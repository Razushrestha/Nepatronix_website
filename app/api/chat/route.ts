import { type NextRequest, NextResponse } from 'next/server';

const KNOWLEDGE_BASE = {
  company: {
    fullName: "NepaTronix Engineering Solutions",
    founded: "2021",
    location: "Tinkune, Kathmandu, Nepal",
    about: "A leading Nepal-based IoT, STEM EdTech, and software company committed to closing the gap between education and innovation. We operate at the intersection of engineering, education, and social impact.",
    mission: "To revolutionize the technological landscape of Nepal by empowering youth with industry-relevant skills and promoting indigenous product development.",
    vision: "To be the leading catalyst in Nepal's journey towards technological self-sufficiency and innovation.",
    founder: {
      name: "Razu Shrestha",
      role: "CEO and Founder",
      message: "Committed to building a future where innovation, education, and engineering come together for real-world impact.",
      contact: "WhatsApp: +977 9803661701"
    }
  },
  services: [
    {
      id: "stem-education",
      name: "Certified STEM Education Solutions",
      details: "Globally aligned framework recognized by Kathmandu University. Focuses on project-based and experiential learning.",
      features: ["Robotics", "Electronics", "AI", "Coding Curriculum"],
      outcomes: ["Critical thinking", "Innovation skills", "Career readiness"]
    },
    {
      id: "stem-lab-setup",
      name: "STEM Lab Infrastructure",
      details: "Turnkey lab design and implementation. Transforms classrooms into interactive innovation hubs.",
      tiers: [
        { name: "Normal", focus: "Foundational STEM & Electronics", features: ["STEM Kits", "Workbench"] },
        { name: "Medium", focus: "Intermediate Robotics & IoT", features: ["3D Printers", "IoT Hubs"] },
        { name: "High-End", focus: "Industrial AI & Prototyping", features: ["Industrial 3D Printers", "AI Workstations", "PCB Milling"] }
      ]
    },
    {
      id: "product-engineering",
      name: "Nep STEM (Product R&D)",
      details: "End-to-end product design, prototyping, and manufacturing for local industries.",
      strengths: ["In-house hardware development", "PCB Design", "Firmware Architecture"]
    },
    {
      id: "kms",
      name: "KMS (Knowledge Management System)",
      details: "Vocational training and intensive workshops for aspiring engineers and students."
    }
  ],
  stats: {
    partnerships: "50+ schools",
    studentsTrained: "25,000+",
    projectsCompleted: "80+ custom solutions",
    teachersCertified: "100+"
  }
};

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const query = message.toLowerCase();

    // High-quality conversational logic
    let response = "";

    // --- ADVANCED CONVERSATIONAL WRAPPER ---
    // This adds a "Chat-GPT" style personality to the responses
    const personaWrap = (text: string) => {
      const intros = [
        "That's a great question! ",
        "I'd be happy to help with that. ",
        "Looking into that for you... ",
        "Intersting! ",
        "Here's what I found from our records: ",
        "Namaste! To answer your query, "
      ];
      const outros = [
        "\n\nDoes that help, or would you like more details?",
        "\n\nI can dive deeper into any of these points if you're interested.",
        "\n\nLet me know if you need anything else!",
        "\n\nShould I connect you with one of our engineers for a deep dive?",
        "\n\nInnovation is at our heart, so feel free to ask more!"
      ];
      
      // Only wrap if it's not a greeting or identity
      if (isGreeting || query.includes("who are you")) return text;
      
      const intro = intros[Math.floor(Math.random() * intros.length)];
      const outro = outros[Math.floor(Math.random() * outros.length)];
      return `${intro}${text}${outro}`;
    };

    // 1. Greetings & Identity (Enhanced with broad matching)
    const isGreeting = /\b(hi|hello|namaste|hey|hy|hlo|helo|hiii|hyy|hey|hola|good morning|good evening)\b/i.test(query);
    
    if (query.includes("who are you") || query.includes("identity") || query.includes("what is your name")) {
      response = "I am Mahabir, your dedicated AI-powered guide at NepaTronix Engineering Solutions. 🇳🇵 I'm here to help you navigate our world of STEM, IoT Research, and Product Innovation!";
    } else if (isGreeting) {
      const greetings = [
        "Namaste! ✨ How can I assist you today? Whether you're interested in our certified robotics courses, need a custom lab setup for your school, or want to explore industrial R&D, I'm here to help!",
        "Hello! 👋 It's a pleasure to connect. I'm Mahabir, and I have all the details on our STEM ecosystems and engineering services. What's on your mind?",
        "Greetings! 🚀 Welcome to NepaTronix. I'm ready to help you explore our future-ready technology solutions. What can I help you find?",
        "Namaste! 🙏 Glad you're here. We're currently leading some amazing STEM initiatives across Nepal. Would you like to hear about our courses or our lab setups?",
        "Hey! 😊 Mahabir at your service. I can walk you through our KU-recognized programs or our industrial-grade prototyping services. Where should we start?"
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 2. Services Queries
    else if (query.includes("service") || query.includes("what do you do") || query.includes("help me with")) {
      response = "We provide four main pillars of innovation: \n1️⃣ **STEM Education**: Certified courses for students and teachers.\n2️⃣ **STEm Lab Setup**: Building innovation hubs in schools.\n3️⃣ **Nep STEM (R&D)**: Engineering custom hardware solutions.\n4️⃣ **KMS**: Advanced vocational training.\n\nWhich one would you like to dive into?";
    } else if (query.includes("lab") || query.includes("infrastructure") || query.includes("setup")) {
      response = "Our STEM Lab setups are legendary! 🛠️ We offer three tiers: \n- **Normal**: For foundational learning.\n- **Medium**: Adds 3D printing and IoT hubs.\n- **High-End**: Industrial-grade AI workstations and PCB milling.\n\nWe handle everything from installation to teacher training. Would you like to see a sample proposal for your institution?";
    } else if (query.includes("course") || query.includes("learn") || query.includes("education") || query.includes("student")) {
      response = "Our STEM programs are recognized by **Kathmandu University**! 🎓 We train students in IoT, Robotics, and AI through real-world projects. It's not just theory—it's building. Are you looking for student courses or teacher certification?";
    } else if (query.includes("product") || query.includes("engineering") || query.includes("r&d") || query.includes("prototype") || query.includes("manufacturing")) {
      response = "NepaTronix is a powerhouse for local R&D. 🔬 We don't just import; we build! Our engineers handle PCB design, firmware, and rapid prototyping in-house. Have an idea for a hardware product? Let's build it together!";
    }

    // 3. Company & Founder
    else if (query.includes("founder") || query.includes("ceo") || query.includes("razu")) {
      response = `Our visionary founder, **Razu Shrestha**, established NepaTronix in 2021. 💡 His mission is to empower Nepal through engineering and education. You can actually reach him directly for major partnerships via WhatsApp at +977 9803661701. He's very focused on long-term impact!`;
    } else if (query.includes("mission") || query.includes("vision") || query.includes("goal")) {
      response = "Our mission is simple yet bold: To revolutionize Nepal's tech landscape by empowering youth with industry-ready skills. We envision a Nepal that is technologically self-sufficient and a global hub for innovation.";
    }

    // 4. Location & Contact
    else if (query.includes("where") || query.includes("location") || query.includes("address") || query.includes("office")) {
      response = "We are located at the heart of Kathmandu in **Tinkune**. 📍 You're always welcome to visit our lab and see the innovation in action! Would you like a Google Maps link?";
    } else if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("reach")) {
      response = "You can reach us at **info@nepatronix.com** or call us at **+977 9803661701**. 📞 We're also very active on WhatsApp for quick inquiries!";
    }

    // 5. General AI fallback (Intelligence beyond the website)
    else {
      // Extensive Knowledge Expansion for most common tech queries
      if (query.includes("what is iot") || query.includes("internet of things")) {
        response = "The Internet of Things (IoT) is a network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the internet. At NepaTronix, we use IoT to build smart automation and industrial monitoring solutions specifically for the Nepali context.";
      } else if (query.includes("robot") || query.includes("robotics")) {
        response = "Robotics is an interdisciplinary branch of computer science and engineering. It involves the design, construction, operation, and use of robots. Our Tinkune lab is where we prototype these systems, ranging from educational bots to industrial automation units.";
      } else if (query.includes("stem")) {
        response = "STEM stands for Science, Technology, Engineering, and Mathematics. Our focus is on making these subjects practical and hands-on. By bridging these four fields, we help students develop critical thinking and problem-solving skills through building real projects.";
      } else if (query.includes("3d print")) {
        response = "3D printing, or additive manufacturing, is the process of making three-dimensional solid objects from a digital file. In our high-end lab setups, we provide industrial-grade 3D printers that allow students and engineers to rapidly prototype their ideas into physical reality.";
      } else if (query.includes("pcb")) {
        response = "A Printed Circuit Board (PCB) mechanically supports and electrically connects electronic components. NepaTronix is one of the few places in Nepal with in-house PCB design and assembly capabilities, allowing for rapid hardware prototyping.";
      } else if (query.includes("ai") || query.includes("artificial intelligence")) {
        response = "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. We focus on 'Applied AI'—practical applications like computer vision for industrial sorting or smart algorithms for educational progress tracking.";
      } else if (query.includes("nepal") && (query.includes("tech") || query.includes("future"))) {
        response = "Nepal is currently witnessing a massive shift towards hardware and software innovation. Our goal at NepaTronix is to ensure that Nepali youth lead this transition, moving from being mere consumers of import tech to creators of indigenous technology.";
      } else {
        // Final fallback
        response = "Sorry, this seems to be an emergency matter. I will forward this to my team; they will reach out to you in a while.";
      }
    }

    return NextResponse.json({ text: isGreeting || query.includes("who are you") ? response : personaWrap(response) }, { status: 200 });
  } catch (error) {
    console.error('Chat AI error:', error);
    return NextResponse.json({ text: "I'm thinking... but my circuits are a bit busy! Could you try rephrasing that? 🤖" }, { status: 500 });
  }
}
