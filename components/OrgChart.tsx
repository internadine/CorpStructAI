import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Company, Person, D3Node } from '../types';

interface OrgChartProps {
  companies: Company[];
  people: Person[];
  onNodeClick: (company: Company) => void;
  onNodePositionUpdate?: (companyId: string, position: { x: number; y: number }) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({ companies, people, onNodeClick, onNodePositionUpdate }) => {
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
      { id: rootId, name: 'Structure', type: 'Root', parentIds: [] } as any,
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
    
    // Tree Layout - increased vertical spacing to prevent overlap
    const treeLayout = d3.tree<any>()
      .nodeSize([nodeWidth + 60, nodeHeight + 150])
      .separation((a, b) => (a.parent === b.parent ? 1.3 : 1.6));
      
    treeLayout(root);

    // Apply custom positions if they exist
    root.each((d: any) => {
      if (d.data.customPosition) {
        d.x = d.data.customPosition.x;
        d.y = d.data.customPosition.y;
      }
    });

    // Zoom behavior
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Add glass blur filter definitions
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glass-blur");
    filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3");

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
      .filter((event) => {
        // Allow zoom with wheel, but prevent zoom when dragging nodes
        // Only allow zoom if not clicking on a node
        return event.type === 'wheel' || 
               (event.type === 'mousedown' && !event.target.closest('.node'));
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
    const secondaryLinkGroup = g.selectAll(".link-secondary-group")
      .data(secondaryLinks)
      .enter()
      .append("g")
      .attr("class", "link-secondary-group");

    secondaryLinkGroup.append("path")
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

    // Add percentage labels to secondary links
    secondaryLinkGroup.each(function(d: any) {
      const targetCompany = companies.find(c => c.id === d.target.data.id);
      const sourceId = d.source.data.id;
      if (targetCompany && targetCompany.parentOwnership && targetCompany.parentOwnership[sourceId] !== undefined) {
        const percentage = targetCompany.parentOwnership[sourceId];
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + nodeHeight/2 + d.target.y - 20) / 2;
        
        d3.select(this).append("text")
          .attr("x", midX)
          .attr("y", midY - 5)
          .attr("text-anchor", "middle")
          .attr("class", "text-[10px] font-bold fill-amber-600")
          .attr("paint-order", "stroke")
          .attr("stroke", "white")
          .attr("stroke-width", "3px")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .text(`${percentage.toFixed(1)}%`);
      }
    });


    // --- Draw Primary Links ---
    const primaryLinkGroup = g.selectAll(".link-group")
      .data(root.links())
      .enter()
      .append("g")
      .attr("class", "link-group");

    primaryLinkGroup.append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      );

    // Add percentage labels to primary links
    primaryLinkGroup.each(function(d: any) {
      const targetCompany = companies.find(c => c.id === d.target.data.id);
      const sourceId = d.source.data.id === 'virtual-root' ? null : d.source.data.id;
      
      if (targetCompany && sourceId && targetCompany.parentOwnership && targetCompany.parentOwnership[sourceId] !== undefined) {
        const percentage = targetCompany.parentOwnership[sourceId];
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        
        d3.select(this).append("text")
          .attr("x", midX)
          .attr("y", midY - 5)
          .attr("text-anchor", "middle")
          .attr("class", "text-[10px] font-bold fill-slate-600")
          .attr("paint-order", "stroke")
          .attr("stroke", "white")
          .attr("stroke-width", "3px")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .text(`${percentage.toFixed(1)}%`);
      }
    });

    // Helper function to update links when a node is dragged
    const updateLinksForNode = (draggedNode: any, g: any, nodeWidth: number, nodeHeight: number, companies: Company[]) => {
      // Update primary links
      g.selectAll(".link-group").each(function(linkData: any) {
        let needsUpdate = false;
        let newPath = '';
        
        if (linkData.source.id === draggedNode.id) {
          // This node is the source
          const srcX = draggedNode.x;
          const srcY = draggedNode.y + nodeHeight/2;
          const dstX = linkData.target.x;
          const dstY = linkData.target.y - 20;
          newPath = d3.linkVertical()
            .x((d: any) => d.x)
            .y((d: any) => d.y)({ source: { x: srcX, y: srcY }, target: { x: dstX, y: dstY } } as any);
          needsUpdate = true;
        } else if (linkData.target.id === draggedNode.id) {
          // This node is the target
          const srcX = linkData.source.x;
          const srcY = linkData.source.y + nodeHeight/2;
          const dstX = draggedNode.x;
          const dstY = draggedNode.y - 20;
          newPath = d3.linkVertical()
            .x((d: any) => d.x)
            .y((d: any) => d.y)({ source: { x: srcX, y: srcY }, target: { x: dstX, y: dstY } } as any);
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          d3.select(this).select("path").attr("d", newPath);
          
          // Update percentage label position
          const targetCompany = companies.find(c => c.id === linkData.target.data.id);
          const sourceId = linkData.source.data.id === 'virtual-root' ? null : linkData.source.data.id;
          if (targetCompany && sourceId && targetCompany.parentOwnership && targetCompany.parentOwnership[sourceId] !== undefined) {
            const percentage = targetCompany.parentOwnership[sourceId];
            const midX = (linkData.source.x + linkData.target.x) / 2;
            const midY = (linkData.source.y + linkData.target.y) / 2;
            d3.select(this).select("text")
              .attr("x", midX)
              .attr("y", midY - 5);
          }
        }
      });
      
      // Update secondary links
      g.selectAll(".link-secondary-group").each(function(linkData: any) {
        let needsUpdate = false;
        let newPath = '';
        
        if (linkData.source.id === draggedNode.id) {
          const srcX = draggedNode.x;
          const srcY = draggedNode.y + nodeHeight/2;
          const dstX = linkData.target.x;
          const dstY = linkData.target.y - 20;
          newPath = `M${srcX},${srcY} C${srcX},${(srcY+dstY)/2} ${dstX},${(srcY+dstY)/2} ${dstX},${dstY}`;
          needsUpdate = true;
        } else if (linkData.target.id === draggedNode.id) {
          const srcX = linkData.source.x;
          const srcY = linkData.source.y + nodeHeight/2;
          const dstX = draggedNode.x;
          const dstY = draggedNode.y - 20;
          newPath = `M${srcX},${srcY} C${srcX},${(srcY+dstY)/2} ${dstX},${(srcY+dstY)/2} ${dstX},${dstY}`;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          d3.select(this).select("path").attr("d", newPath);
          
          // Update percentage label position
          const targetCompany = companies.find(c => c.id === linkData.target.data.id);
          const sourceId = linkData.source.data.id;
          if (targetCompany && targetCompany.parentOwnership && targetCompany.parentOwnership[sourceId] !== undefined) {
            const percentage = targetCompany.parentOwnership[sourceId];
            const midX = (linkData.source.x + linkData.target.x) / 2;
            const midY = (linkData.source.y + nodeHeight/2 + linkData.target.y - 20) / 2;
            d3.select(this).select("text")
              .attr("x", midX)
              .attr("y", midY - 5);
          }
        }
      });
    };

    // --- Draw Nodes ---
    // Track which nodes were actually dragged to prevent click events
    const draggedNodes = new Set<string>();
    
    const node = g.selectAll(".node")
      .data(root.descendants().slice(1)) // Skip virtual root
      .enter()
      .append("g")
      .attr("class", "node cursor-move transition-opacity hover:opacity-90")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .on("click", (event, d: any) => {
        // Only trigger click if node wasn't dragged
        if (!draggedNodes.has(d.data.id)) {
          event.stopPropagation();
          onNodeClick(d.data as Company);
        }
        // Clear the dragged flag after handling click
        draggedNodes.delete(d.data.id);
      });

    // Add drag behavior - works with zoom transform
    const drag = d3.drag<any, any>()
      .filter((event) => {
        // Allow drag on left mouse button, but not on right click or when holding modifier keys
        // Also prevent drag if clicking on settings icon
        const target = event.target as HTMLElement;
        const isSettingsIcon = target.closest('.settings-icon') !== null;
        return event.button === 0 && !event.ctrlKey && !event.metaKey && !isSettingsIcon;
      })
      .on("start", function(event, d: any) {
        d3.select(this).raise().attr("opacity", 0.8);
        // Don't stop propagation here - let click handler check if drag occurred
      })
      .on("drag", function(event, d: any) {
        // Mark this node as dragged if it moved significantly
        const moveDistance = Math.sqrt(event.dx * event.dx + event.dy * event.dy);
        if (moveDistance > 3) { // Threshold to distinguish click from drag
          draggedNodes.add(d.data.id);
        }
        
        // Get current zoom transform
        const transform = d3.zoomTransform(svg.node()!);
        // Calculate new position - event.dx/dy are already in screen coordinates
        // We need to convert to data coordinates by dividing by zoom scale
        const newX = d.x + event.dx / transform.k;
        const newY = d.y + event.dy / transform.k;
        
        // Update node position in data
        d.x = newX;
        d.y = newY;
        // Update visual position (transform is applied by the g element, so we use data coordinates)
        d3.select(this).attr("transform", `translate(${newX},${newY})`);
        
        // Update links connected to this node
        updateLinksForNode(d, g, nodeWidth, nodeHeight, companies);
      })
      .on("end", function(event, d: any) {
        d3.select(this).attr("opacity", 1);
        
        // Save custom position if node was actually moved
        if (draggedNodes.has(d.data.id) && onNodePositionUpdate) {
          onNodePositionUpdate(d.data.id, { x: d.x, y: d.y });
        }
      });

    node.call(drag);

    // Helper function to get node color (custom or default)
    const getNodeColor = (d: any) => {
      if (d.data.color) return d.data.color;
      const type = d.data.type;
      if (type.includes('Holding')) return '#2563eb'; // blue
      if (type.includes('GmbH')) return '#059669'; // emerald
      return '#64748b'; // slate
    };

    // Card Background - Solid base layer to block lines
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", (d: any) => {
        let baseHeight = nodeHeight + 7; // Extra space for badge
        if (d.data.people?.length) baseHeight += d.data.people.length * 22;
        if (d.data.businessJustification) baseHeight += 30;
        if (d.data.financialResources) baseHeight += 20;
        if (d.data.companyResources?.length) baseHeight += d.data.companyResources.length * 18;
        return Math.max(baseHeight, 77); // Minimum height increased to accommodate badge
      })
      .attr("x", -nodeWidth / 2)
      .attr("y", 0)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "rgba(255, 255, 255, 0.95)") // Solid white base to block lines
      .attr("stroke", "none")
      .attr("opacity", 1);

    // Glass overlay layer for visual effect
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", (d: any) => {
        let baseHeight = nodeHeight + 7;
        if (d.data.people?.length) baseHeight += d.data.people.length * 22;
        if (d.data.businessJustification) baseHeight += 30;
        if (d.data.financialResources) baseHeight += 20;
        if (d.data.companyResources?.length) baseHeight += d.data.companyResources.length * 18;
        return Math.max(baseHeight, 77);
      })
      .attr("x", -nodeWidth / 2)
      .attr("y", 0)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "rgba(255, 255, 255, 0.4)") // Glass overlay
      .attr("stroke", getNodeColor)
      .attr("stroke-width", 2.5)
      .attr("filter", "drop-shadow(0px 8px 16px rgba(0,0,0,0.25))");

    // Header Color Strip (on top of glass overlay)
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", 6)
      .attr("x", -nodeWidth / 2)
      .attr("y", 0)
      .attr("rx", 4)
      .attr("fill", getNodeColor)
      .attr("opacity", 0.9);

    // Company Type Badge (positioned inside node, below header strip)
    node.append("rect")
      .attr("x", -nodeWidth / 2 + 10)
      .attr("y", 10)
      .attr("width", (d:any) => Math.min(d.data.type.length * 7 + 20, nodeWidth - 20))
      .attr("height", 18)
      .attr("rx", 9)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "rgba(203, 213, 225, 0.8)")
      .attr("stroke-width", 1);
    
    node.append("text")
      .attr("x", -nodeWidth / 2 + 20)
      .attr("y", 22)
          .attr("class", "text-[10px] font-bold fill-slate-800 uppercase tracking-wide")
      .text((d: any) => {
          const t = d.data.type;
          return t.length > 25 ? t.substring(0, 22) + '...' : t;
      });

    // Company Name (positioned below badge)
    node.append("text")
      .attr("dy", 45)
      .attr("text-anchor", "middle")
          .attr("class", "font-bold text-sm fill-slate-900")
      .style("font-family", "Inter, sans-serif")
      .text((d: any) => d.data.name.length > 30 ? d.data.name.substring(0, 27) + '...' : d.data.name);

    // Settings wheel icon - clickable to open edit modal (positioned first to avoid overlap)
    node.each(function(d: any) {
        const settingsGroup = d3.select(this).append("g")
            .attr("class", "settings-icon")
            .attr("transform", `translate(${nodeWidth/2 - 22}, 19)`)
            .style("cursor", "pointer")
            .style("pointer-events", "all")
            .on("click", function(event) {
                event.stopPropagation();
                event.preventDefault();
                onNodeClick(d.data as Company);
            })
            .on("mouseenter", function() {
                d3.select(this).select("circle").attr("fill", "rgba(99, 102, 241, 0.2)");
                d3.select(this).selectAll("path").attr("stroke", "#6366f1");
            })
            .on("mouseleave", function() {
                d3.select(this).select("circle").attr("fill", "rgba(255, 255, 255, 0.6)");
                d3.select(this).selectAll("path").attr("stroke", "#64748b");
            });

        // Background circle
        settingsGroup.append("circle")
            .attr("r", 12)
            .attr("fill", "rgba(255, 255, 255, 0.6)")
            .attr("stroke", "rgba(100, 116, 139, 0.3)")
            .attr("stroke-width", 1);

        // Settings gear icon (SVG path)
        settingsGroup.append("path")
            .attr("d", "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z")
            .attr("transform", "scale(0.4) translate(-12, -12)")
            .attr("fill", "none")
            .attr("stroke", "#64748b")
            .attr("stroke-width", "2.5")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round");
        
        settingsGroup.append("path")
            .attr("d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z")
            .attr("transform", "scale(0.4) translate(-12, -12)")
            .attr("fill", "none")
            .attr("stroke", "#64748b")
            .attr("stroke-width", "2.5")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round");
    });

    // Ownership Count Indicator (if multiple parents) - positioned to the left of settings wheel
    node.each(function(d: any) {
        if (d.data.parentIds && d.data.parentIds.length > 1) {
            // Position to the left of settings wheel (which is at nodeWidth/2 - 22)
            d3.select(this).append("circle")
                .attr("cx", nodeWidth/2 - 50)
                .attr("cy", 19)
                .attr("r", 9)
                .attr("fill", "#fbbf24")
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
            
            d3.select(this).append("text")
                .attr("x", nodeWidth/2 - 50)
                .attr("y", 23)
                .attr("text-anchor", "middle")
                .attr("class", "text-[10px] font-bold fill-white")
                .text(d.data.parentIds.length);
        }
    });

    // Separator (positioned below company name)
    node.append("line")
      .attr("x1", -nodeWidth / 2 + 15)
      .attr("x2", nodeWidth / 2 - 15)
      .attr("y1", 60)
      .attr("y2", 60)
      .attr("stroke", "#e2e8f0");

    // People List (positioned below separator)
    const peopleGroup = node.append("g")
      .attr("transform", "translate(0, 75)");

    peopleGroup.each(function(d: any) {
      const g = d3.select(this);
      const peopleList = d.data.people || [];
      let yOffset = 0;
      
      peopleList.forEach((p: Person, i: number) => {
        // Icon
        g.append("circle")
          .attr("cx", -nodeWidth/2 + 25)
          .attr("cy", yOffset + i * 24)
          .attr("r", 4)
          .attr("fill", "#94a3b8");

        // Role
        g.append("text")
          .attr("x", -nodeWidth/2 + 36)
          .attr("y", yOffset + i * 24 + 4)
          .attr("class", "text-[11px] fill-slate-700 font-medium")
          .text(`${p.role}:`);
          
        // Name
        g.append("text")
          .attr("x", -nodeWidth/2 + 36 + (p.role.length * 6) + 10) // Approx spacing
          .attr("y", yOffset + i * 24 + 4)
          .attr("class", "text-[11px] fill-slate-800 font-semibold")
          .text(p.name);
      });
      
      yOffset = peopleList.length * 24;
      
      // Business Justification
      if (d.data.businessJustification) {
        g.append("line")
          .attr("x1", -nodeWidth / 2 + 15)
          .attr("x2", nodeWidth / 2 - 15)
          .attr("y1", yOffset + 8)
          .attr("y2", yOffset + 8)
          .attr("stroke", "#e2e8f0");
        
        g.append("text")
          .attr("x", -nodeWidth/2 + 20)
          .attr("y", yOffset + 22)
          .attr("class", "text-[10px] fill-slate-700 font-medium")
          .text("Gegenstand:");
        
        const justificationText = d.data.businessJustification.length > 35 
          ? d.data.businessJustification.substring(0, 32) + '...'
          : d.data.businessJustification;
        
        g.append("text")
          .attr("x", -nodeWidth/2 + 20)
          .attr("y", yOffset + 35)
          .attr("class", "text-[10px] fill-slate-600")
          .text(justificationText);
        
        yOffset += 30;
      }
      
      // Financial Resources
      if (d.data.financialResources) {
        if (yOffset > 0) {
          g.append("line")
            .attr("x1", -nodeWidth / 2 + 15)
            .attr("x2", nodeWidth / 2 - 15)
            .attr("y1", yOffset + 8)
            .attr("y2", yOffset + 8)
            .attr("stroke", "#e2e8f0");
          yOffset += 8;
        }
        
        const formattedAmount = new Intl.NumberFormat('de-DE', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true
        }).format(d.data.financialResources);
        
        g.append("text")
          .attr("x", -nodeWidth/2 + 20)
          .attr("y", yOffset + 18)
          .attr("class", "text-[10px] fill-slate-700 font-medium")
          .text("Finanzmittel:");
        
        g.append("text")
          .attr("x", -nodeWidth/2 + 20)
          .attr("y", yOffset + 30)
          .attr("class", "text-[10px] fill-emerald-600 font-semibold")
          .text(formattedAmount);
        
        yOffset += 20;
      }
      
      // Company Resources
      if (d.data.companyResources && d.data.companyResources.length > 0) {
        if (yOffset > 0) {
          g.append("line")
            .attr("x1", -nodeWidth / 2 + 15)
            .attr("x2", nodeWidth / 2 - 15)
            .attr("y1", yOffset + 8)
            .attr("y2", yOffset + 8)
            .attr("stroke", "#e2e8f0");
          yOffset += 8;
        }
        
        d.data.companyResources.forEach((resource: any, i: number) => {
          const resourceText = resource.name + (resource.value ? ` (${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true }).format(resource.value)})` : '');
          const displayText = resourceText.length > 30 ? resourceText.substring(0, 27) + '...' : resourceText;
          
          g.append("text")
            .attr("x", -nodeWidth/2 + 20)
            .attr("y", yOffset + 18 + i * 18)
          .attr("class", "text-[10px] fill-slate-800")
          .text(`• ${displayText}`);
        });
      }
    });

  }, [companies, people, dimensions]);

  return (
    <div ref={wrapperRef} className="OrgChart w-full h-full glass-strong relative overflow-hidden rounded-2xl border border-white/40 shadow-2xl">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-4 glass border border-white/30 px-3 py-2 rounded-xl text-xs text-slate-900 shadow-lg pointer-events-none backdrop-blur-xl font-medium">
        <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-0.5 bg-slate-600"></span>
            <span className="font-semibold">Primary Holding</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-500 border-t border-dashed border-amber-500"></span>
            <span className="font-semibold">Minority Holding</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 glass border border-white/30 px-3 py-1 rounded-xl text-xs text-slate-900 shadow-lg pointer-events-none backdrop-blur-xl font-medium">
        Scroll to Zoom • Drag to Move • Move Nodes
      </div>
    </div>
  );
};

export default OrgChart;
