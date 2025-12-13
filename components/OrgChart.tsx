import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Company, Person, D3Node } from '../types';

interface OrgChartProps {
  companies: Company[];
  people: Person[];
  onNodeClick: (company: Company) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({ companies, people, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || companies.length === 0) return;

    // 1. Prepare Data Hierarchy
    // To visualize multi-parent DAG as a tree, we pick the FIRST parent as the "Tree Parent".
    // We will draw extra lines for subsequent parents later.
    const rootId = 'virtual-root';
    
    // Check if there are any loops or disconnected graphs? D3 stratify handles single root.
    // We map all nodes with NO parents to virtual-root.
    
    const hierarchyData = [
      { id: rootId, name: 'Struktur', type: 'Root', parentIds: [] } as any,
      ...companies.map(c => ({
        ...c,
        // Primary parent for Tree Layout
        primaryParentId: (c.parentIds && c.parentIds.length > 0) ? c.parentIds[0] : rootId,
        people: people.filter(p => p.companyId === c.id)
      }))
    ];

    // D3 Stratify using the primary parent
    let root: d3.HierarchyNode<any>;
    try {
      root = d3.stratify<any>()
        .id(d => d.id)
        .parentId(d => d.primaryParentId)(hierarchyData);
    } catch (e) {
      console.error("Ungültige Hierarchie-Daten", e);
      // Fallback: Just show simple list if tree breaks? 
      return; 
    }

    const nodeWidth = 240;
    const nodeHeight = 130;
    
    // Tree Layout
    const treeLayout = d3.tree<any>()
      .nodeSize([nodeWidth + 60, nodeHeight + 80])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.4));
      
    treeLayout(root);

    // Zoom behavior
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Initial Center
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    root.each(d => {
      // @ts-ignore
      if (d.x > x1) x1 = d.x;
      // @ts-ignore
      if (d.x < x0) x0 = d.x;
      // @ts-ignore
      if (d.y > y1) y1 = d.y;
      // @ts-ignore
      if (d.y < y0) y0 = d.y;
    });

    const initialScale = 0.7;
    const initialX = (dimensions.width / 2) - ((x0 + x1) / 2) * initialScale;
    const initialY = 80;

    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));

    // --- Draw "Secondary" Links (Multi-Parent) ---
    // These are links for parentIds[1], parentIds[2], etc.
    const secondaryLinks: {source: any, target: any}[] = [];
    const nodeMap = new Map(root.descendants().map(d => [d.id, d]));

    companies.forEach(c => {
      if (c.parentIds && c.parentIds.length > 1) {
        const targetNode = nodeMap.get(c.id);
        // Start from index 1 (second parent)
        for (let i = 1; i < c.parentIds.length; i++) {
          const sourceNode = nodeMap.get(c.parentIds[i]);
          if (sourceNode && targetNode) {
            secondaryLinks.push({ source: sourceNode, target: targetNode });
          }
        }
      }
    });

    // Draw Secondary Links first (dashed)
    g.selectAll(".link-secondary")
      .data(secondaryLinks)
      .enter()
      .append("path")
      .attr("class", "link-secondary")
      .attr("fill", "none")
      .attr("stroke", "#fbbf24") // Amber for secondary
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", (d: any) => {
          const srcX = d.source.x;
          const srcY = d.source.y + nodeHeight/2; // From bottom of parent
          const dstX = d.target.x;
          const dstY = d.target.y - 20; // To top of child
          return `M${srcX},${srcY} C${srcX},${(srcY+dstY)/2} ${dstX},${(srcY+dstY)/2} ${dstX},${dstY}`;
      });


    // --- Draw Primary Links ---
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      );

    // --- Draw Nodes ---
    const node = g.selectAll(".node")
      .data(root.descendants().slice(1)) // Skip virtual root
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer transition-opacity hover:opacity-90")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .on("click", (event, d) => {
        onNodeClick(d.data as Company);
      });

    // Card Background
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", (d: any) => Math.max(nodeHeight, 70 + (d.data.people?.length || 0) * 22))
      .attr("x", -nodeWidth / 2)
      .attr("y", 0)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "white")
      .attr("stroke", (d: any) => {
        const type = d.data.type;
        if (type.includes('Holding')) return '#2563eb'; // blue
        if (type.includes('GmbH')) return '#059669'; // emerald
        return '#64748b'; // slate
      })
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))");

    // Header Color Strip
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", 6)
      .attr("x", -nodeWidth / 2)
      .attr("y", 0)
      .attr("rx", 4)
      .attr("fill", (d: any) => {
         const type = d.data.type;
         if (type.includes('Holding')) return '#2563eb';
         if (type.includes('GmbH')) return '#059669';
         return '#64748b';
      });

    // Company Name
    node.append("text")
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("class", "font-bold text-sm fill-slate-800")
      .style("font-family", "Inter, sans-serif")
      .text((d: any) => d.data.name.length > 30 ? d.data.name.substring(0, 27) + '...' : d.data.name);

    // Company Type Badge
    node.append("rect")
      .attr("x", -nodeWidth / 2 + 10)
      .attr("y", -14)
      .attr("width", (d:any) => Math.min(d.data.type.length * 7 + 20, nodeWidth - 20))
      .attr("height", 26)
      .attr("rx", 13)
      .attr("fill", "#f8fafc")
      .attr("stroke", "#cbd5e1");
    
    node.append("text")
      .attr("x", -nodeWidth / 2 + 20)
      .attr("y", 4)
      .attr("class", "text-[10px] font-bold fill-slate-600 uppercase tracking-wide")
      .text((d: any) => {
          const t = d.data.type;
          return t.length > 25 ? t.substring(0, 22) + '...' : t;
      });

    // Ownership Count Indicator (if multiple parents)
    node.each(function(d: any) {
        if (d.data.parentIds && d.data.parentIds.length > 1) {
            d3.select(this).append("circle")
                .attr("cx", nodeWidth/2 - 15)
                .attr("cy", 0)
                .attr("r", 10)
                .attr("fill", "#fbbf24")
                .attr("stroke", "#fff");
            
            d3.select(this).append("text")
                .attr("x", nodeWidth/2 - 15)
                .attr("y", 4)
                .attr("text-anchor", "middle")
                .attr("class", "text-[10px] font-bold fill-white")
                .text(d.data.parentIds.length);
        }
    });

    // Separator
    node.append("line")
      .attr("x1", -nodeWidth / 2 + 15)
      .attr("x2", nodeWidth / 2 - 15)
      .attr("y1", 50)
      .attr("y2", 50)
      .attr("stroke", "#e2e8f0");

    // People List
    const peopleGroup = node.append("g")
      .attr("transform", "translate(0, 65)");

    peopleGroup.each(function(d: any) {
      const g = d3.select(this);
      const peopleList = d.data.people || [];
      
      peopleList.forEach((p: Person, i: number) => {
        // Icon
        g.append("circle")
          .attr("cx", -nodeWidth/2 + 25)
          .attr("cy", i * 24)
          .attr("r", 4)
          .attr("fill", "#94a3b8");

        // Role
        g.append("text")
          .attr("x", -nodeWidth/2 + 36)
          .attr("y", i * 24 + 4)
          .attr("class", "text-[11px] fill-slate-500 font-medium")
          .text(`${p.role}:`);
          
        // Name
        g.append("text")
          .attr("x", -nodeWidth/2 + 36 + (p.role.length * 6) + 10) // Approx spacing
          .attr("y", i * 24 + 4)
          .attr("class", "text-[11px] fill-slate-800 font-semibold")
          .text(p.name);
      });
    });

  }, [companies, people, dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full bg-slate-50 relative overflow-hidden rounded-xl border border-slate-200 shadow-inner">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 shadow-sm pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-0.5 bg-slate-400"></span>
            <span>Hauptbeteiligung</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 border-t border-dashed border-amber-400"></span>
            <span>Nebenbeteiligung</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs text-slate-500 pointer-events-none">
        Scrollen zum Zoomen • Ziehen zum Bewegen
      </div>
    </div>
  );
};

export default OrgChart;
