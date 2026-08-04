const axios = require('axios');

async function run() {
  const token = process.env.MIRO_ACCESS_TOKEN;
  if (!token) {
    console.error("Error: MIRO_ACCESS_TOKEN environment variable is not set.");
    console.error("Please run the script with: MIRO_ACCESS_TOKEN=your_token node create_miro_board.js");
    process.exit(1);
  }

  const client = axios.create({
    baseURL: 'https://api.miro.com/v2',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  try {
    console.log("Creating new Miro board...");
    const boardRes = await client.post('/boards', {
      name: 'Ahana Hospitals - End-to-End Feature Mapping',
      description: 'End-to-end multi-tenant SaaS application feature release tracking board'
    });

    const boardId = boardRes.data.id;
    const boardUrl = boardRes.data.viewLink;
    console.log(`Board created successfully! ID: ${boardId}`);
    console.log(`Link: ${boardUrl}`);

    const features = [
      // Complete Features (Green)
      { title: "Dynamic Tenant Subdomains\n& URL routing checks", status: "complete", col: 0 },
      { title: "Custom Parent Domain\nCheckout Flow", status: "complete", col: 0 },
      { title: "Tenant Subscriptions\n& Dynamic Colors Provisioning", status: "complete", col: 0 },
      { title: "Supabase PKCE OAuth / Login\n& Check-Email confirmation", status: "complete", col: 0 },
      { title: "Dynamic Role Profiles\n(Professional vs Member consoles)", status: "complete", col: 0 },
      { title: "PKCE Verification Routing\nRelative to Active Tenant", status: "complete", col: 0 },
      { title: "operations Console\nPatient Inquiry table list", status: "complete", col: 0 },
      { title: "Inquiry Editing & Rescheduling\nServer-Action validation modal", status: "complete", col: 0 },
      { title: "Customizable Table Columns\nSession preferences persistence", status: "complete", col: 0 },
      { title: "Full Clinical Calendar\nColor-coded Doctor events", status: "complete", col: 0 },
      { title: "Interactive EMR Lookup Search\n(First name, Last name, DOB checks)", status: "complete", col: 0 },
      { title: "8 Clinical EMR Chart Panels\n(Progress notes, shift notes, etc.)", status: "complete", col: 0 },
      { title: "EMR Entry Appending Modals\nwith dynamically prepended timeline", status: "complete", col: 0 },
      { title: "Fallback Patient Onboarding Form\n(Immediate profile registration)", status: "complete", col: 0 },
      { title: "Playwright E2E Integration tests\n(Full green validation)", status: "complete", col: 0 },

      // Pending / In-Progress Features (Yellow)
      { title: "Custom Dashboard Widget Preferences\nfor patient roles", status: "pending", col: 1 },
      { title: "Master RACI Matrix\nFeature Ownership tracking spreadsheet", status: "pending", col: 1 },

      // Yet to Start (Red)
      { title: "Wildcard CNAME Dynamic Subdomain\nMapping on Vercel platform", status: "yet-to-start", col: 2 }
    ];

    const colors = {
      'complete': 'light_green',    // light green
      'pending': 'light_yellow',    // light yellow
      'yet-to-start': 'light_pink'  // light red
    };

    console.log("Adding sticky notes to board...");
    
    // Track row indices per column to place items vertically
    const columnRowCounts = [0, 0, 0];

    // Add titles above columns
    const columnTitles = [
      { text: "✅ COMPLETE", col: 0, color: "green" },
      { text: "⏳ IN PROGRESS / PENDING", col: 1, color: "yellow" },
      { text: "🎯 YET TO START", col: 2, color: "red" }
    ];

    for (const title of columnTitles) {
      const x = title.col * 400 - 400;
      const y = -150;
      
      // Let's create a text shape or a rectangle for the header
      await client.post(`/boards/${boardId}/shapes`, {
        data: {
          content: `<p><strong>${title.text}</strong></p>`,
          shape: 'rectangle'
        },
        style: {
          fillColor: title.color === 'green' ? '#D4EDDA' : title.color === 'yellow' ? '#FFF3CD' : '#F8D7DA',
          textColor: '#000000',
          textAlign: 'center'
        },
        position: {
          x: x,
          y: y
        },
        geometry: {
          width: 300,
          height: 60
        }
      });
    }

    // Insert sticky notes
    for (const feat of features) {
      const colIndex = feat.col;
      const rowCount = columnRowCounts[colIndex]++;
      
      const x = colIndex * 400 - 400; // Space columns out
      const y = rowCount * 260;       // Space rows out vertically

      await client.post(`/boards/${boardId}/sticky_notes`, {
        data: {
          content: feat.title,
          shape: 'square'
        },
        style: {
          fillColor: colors[feat.status],
          textAlign: 'center',
          textAlignVertical: 'middle'
        },
        position: {
          x: x,
          y: y
        }
      });
      
      // Delay slightly to respect rate limit
      await new Promise(r => setTimeout(r, 150));
    }

    console.log("All features successfully mapped to Miro board!");
    console.log(`\nYour board URL is: ${boardUrl}\n`);
  } catch (error) {
    console.error("Miro API Error:", error.response ? error.response.data : error.message);
  }
}

run();
