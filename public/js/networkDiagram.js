const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        let nodes = [];
        let links = [];

        function drawDiagram({ nodes: initialNodes, links: initialLinks }) {
            nodes = initialNodes;
            links = initialLinks;

            //Update Connects To dropdown call
            updateConnectsToDropdown();

            // Function to draw the network diagram
            svg.selectAll("*").remove();

            // Setting up the simulation with forces
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(150))
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .on("tick", ticked)
                .on("end", () => {
            // After simulation has stabilized, fixing the node positions
                    nodes.forEach(d => {
                        d.fx = d.x;
                        d.fy = d.y;
                    });
                });

            // Creating links
            const link = svg.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("stroke-width",d => Math.sqrt(d.value));

            // Creating nodes with images and labels grouped together
            const nodeGroup = svg.append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .selectAll("g")
                .data(nodes)
                .enter().append("g")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            nodeGroup.append("image")
                .attr("xlink:href", d => {
                    if (d.type === 'server') {
                        return 'https://www.svgrepo.com/show/513345/server.svg';  // Server image
                    } else if (d.type === 'firewall') {
                        return 'https://www.svgrepo.com/show/484452/firewall.svg';  // Firewall image
                    } else {
                        return '';
                    }
                })
                .attr("width", 50)
                .attr("height", 50);

            nodeGroup.append("text")
                .attr("dx", 60)
                .attr("dy", "-0.2em")
                .attr("fill", "black")
                .text(d => d.id);

            nodeGroup.append("text")
                .attr("dx", 60)
                .attr("dy", "1.25em")
                .attr("attr", "black")
                .text(d => d.ip);

            // Defining the tick function for the simulation
            function ticked() {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                nodeGroup
                    .attr("transform", d => {
                        // Constrain node positions to stay within SVG boundaries
                        d.x = Math.max(25, Math.min(width - 25, d.x)); // Keeps within left and right bounds
                        d.y = Math.max(25, Math.min(height - 25, d.y)); // Keeps within top and bottom bounds
                        return `translate(${d.x - 25},${d.y - 25})`;
                    });
            }

            // Dragging functions for interactivity
            function dragstarted(event, d) {
                d3.select(this).raise().attr("stroke", "black");
            }

            function dragged(event, d) {
                // Constrain the x and y position of the node within the SVG boundaries
                d.fx = Math.max(10, Math.min(width - 10, event.x));
                d.fy = Math.max(10, Math.min(height - 10, event.y));

                // Update position of the entire node group (image + label)
                d3.select(this)
                    .attr("transform", `translate(${d.fx - 25},${d.fy - 25})`);

                // Updating the links dynamically while dragging
                svg.selectAll("line")
                    .filter(l => l.source.id === d.id || l.target.id === d.id)
                    .attr("x1", l => l.source.fx)
                    .attr("y1", l => l.source.fy)
                    .attr("x2", l => l.target.fx)
                    .attr("y2", l => l.target.fy);
            }

            function dragended(event, d) {
                // Keep the image fixed at the new position
                d3.select(this).attr("stroke", "#fff");
            }
        }

        // Handle the form submission
        document.getElementById('uploadForm').onsubmit = async function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Draw the network diagram with received data
                drawDiagram(data);
            } else {
                console.error('Error uploading file:', response.statusText);
            }
        };

        //function to load connectsTo dropdownlist
        function updateConnectsToDropdown() {
            const connectsToDropdown = document.getElementById("connectsTo");
            connectsToDropdown.innerHTML = '';

            // Populate the dropdown with current node names
            nodes.forEach(node => {
                const option = document.createElement("option");
                option.value = node.id;
                option.text = node.id;
                connectsToDropdown.appendChild(option);
            });
        }

        // Handling the Add Device button click
        document.getElementById("addDeviceButton").onclick = function () {
            const deviceName = document.getElementById("deviceName").value;
            const deviceType = document.getElementById("deviceType").value;
            const ipAddress = document.getElementById("ipAddress").value;
            const connectsTo = document.getElementById("connectsTo").value;

            if (!deviceName || !ipAddress) {
                alert("Please fill in all fields for the device.");
                return;
            }

            // Add the new node and link to the diagram data
            const newNode = { id: deviceName, ip: ipAddress, type: deviceType };
            nodes.push(newNode);
            links.push({ source: deviceName, target: connectsTo, value: 10 });

            // Redraw the diagram with the new node and link
            drawDiagram({ nodes, links });

            // Reset the form fields
            document.getElementById("addDeviceForm").reset();
            updateConnectsToDropdown();
        };

        
       //save as pdf
       document.getElementById('saveAsPdf').addEventListener('click', async () => {
        const svgElement = document.querySelector('svg');
        const svgRect = svgElement.getBoundingClientRect();

        // Clone the SVG element for rendering
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match the SVG dimensions
        canvas.width = svgRect.width;
        canvas.height = svgRect.height;

        // Use an image to render the SVG on canvas
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const pdf = new jspdf.jsPDF({
                orientation: svgRect.width > svgRect.height ? 'landscape' : 'portrait',
                unit: 'pt',
                format: [svgRect.width, svgRect.height]
            });

            // Convert canvas to PNG and add it to the PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, svgRect.width, svgRect.height);

            // Save the PDF
            pdf.save('network-diagram.pdf');
        };

        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    });
        
        
        
        