import type { TopicStage } from '../types/game';

export const TOPIC_STAGES: TopicStage[] = [
  // =========================================================================
  // SEMESTER 1 — MERGED 小時鐘 P4 TOPICS 1-7 + NEW SCIENCE 4A UNITS 1-4
  // Each stage provides 3 brand-new PDF-derived primary quests + 3 banked
  // syllabus quests (6 questions per topic = 84-question P4 Science Bank).
  // =========================================================================
  {
    id: 1,
    semester: 1,
    topicCode: 'Topic 1',
    title: 'About the Earth (I): Structure, Rocks & Soil',
    subtitle: 'Layers of the Earth, tectonic plates, rock types, and soil drainage',
    mergedSource: '小時鐘 P4 Topic 1 + New Science 4A Unit 1 (Ch. 1 & Revision)',
    focusDomain: 'Earth & Space',
    biome: 'earth_crust',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-1',
      name: 'Crust Explorer',
      color: '#ea580c',
      icon: '🌋',
    },
    rewardResource: {
      id: 'granite_block',
      name: 'Granite Block',
      color: '#a8a29e',
      accentColor: '#f97316',
      icon: '🪨',
    },
    sparkyIntro:
      'Bryan & Caden, check Fred’s scratch test and Jenny’s soil bag experiment! Solve all 3 Earth beacons to collect Granite Blocks!',
    quests: [
      {
        id: 't1-q1',
        type: 'mcq',
        title: 'Fred’s Rock Scratch Test',
        prompt:
          'In New Science 4A Ch.1, Fred found a rock with black and white spots and large grains. Scratching it with a key and a small knife left NO marks on its surface. What rock is it, and how is it commonly used?',
        options: [
          'Sandstone (sedimentary rock, soft); used to make blackboard chalk',
          'Granite (igneous rock, very hard); commonly used as building materials',
          'Marble (metamorphic rock); melts easily into magma',
          'Shale (sedimentary rock); used to grow desert cacti',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Neither a key nor a small knife could scratch this black-and-white spotted rock — that proves it is very hard Granite!',
        explanation:
          'Fred tested Granite (an igneous rock formed from cooled magma). Because it has large grains, black-and-white spots, and is very hard, it is widely used in construction as building materials.',
        resourceBonus: 2,
      },
      {
        id: 't1-q2',
        type: 'mcq',
        title: 'Jenny’s Plastic-Bag Soil Experiment & HK Rocks',
        prompt:
          'Jenny sealed some soil inside a transparent plastic bag under the Sun, and water droplets soon appeared inside the bag. What did she prove, AND what is true about most Hong Kong rocks?',
        options: [
          'Soil contains water; about 85% of Hong Kong’s rocks (e.g. Lantau Peak & Ma On Shan) are igneous rocks',
          'Sunlight turns sand into magma; 85% of Hong Kong rocks are formed under high pressure',
          'Soil contains only air; granite has finer grains than sandstone',
          'Plastic bags create minerals; Hong Kong has no igneous rocks',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Leaving soil in a sealed bag in the Sun traps water vapour that condenses into droplets — and remember HK Revision p.22!',
        explanation:
          'Jenny’s experiment proves soil contains water (along with rock particles, air, minerals, and humus). In Hong Kong, igneous rocks cover ~85% of the land (such as Lantau Peak and Ma On Shan).',
        resourceBonus: 2,
      },
      {
        id: 't1-q3',
        type: 'classify',
        title: 'Earth Crust, Mantle & Rock Misconception Check',
        prompt:
          'Inspect these statements from 小時鐘 Topic 1 & Revision and sort them into TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Science Fact',
            color: '#16a34a',
            description: 'Matches P4 Earth structure & rock facts',
          },
          {
            id: 'false',
            label: 'Common Misconception',
            color: '#dc2626',
            description: 'Contains a mistake to fix',
          },
        ],
        items: [
          {
            id: 't1-c1',
            label: 'Magma is located in the mantle, which is NOT completely liquid',
            emoji: '🌋',
            correctCategory: 'true',
          },
          {
            id: 't1-c2',
            label: 'Parts of the Earth’s crust are covered by ocean and river water',
            emoji: '🌊',
            correctCategory: 'true',
          },
          {
            id: 't1-c3',
            label: 'The Earth’s crust is divided into only 4 plates and contains magma',
            emoji: '🧩',
            correctCategory: 'false',
          },
          {
            id: 't1-c4',
            label: 'Sandstone particles are larger than granite particles',
            emoji: '🏜️',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: The crust is broken into MANY tectonic plates (not just 4!), magma sits in the mantle, and granite has larger grains than sandstone!',
        explanation:
          'The crust is divided into many tectonic plates, parts of which sit under oceans. Hot magma lies in the mantle (which is partly solid, not completely liquid), and igneous granite has larger grains than sandstone.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't1-q1',
        type: 'mcq',
        title: 'Fred’s Rock Scratch Test',
        prompt:
          'In New Science 4A Ch.1, Fred found a rock with black and white spots and large grains. Scratching it with a key and a small knife left NO marks on its surface. What rock is it, and how is it commonly used?',
        options: [
          'Sandstone (sedimentary rock, soft); used to make blackboard chalk',
          'Granite (igneous rock, very hard); commonly used as building materials',
          'Marble (metamorphic rock); melts easily into magma',
          'Shale (sedimentary rock); used to grow desert cacti',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Neither a key nor a small knife could scratch this black-and-white spotted rock — that proves it is very hard Granite!',
        explanation:
          'Fred tested Granite (an igneous rock formed from cooled magma). Because it has large grains, black-and-white spots, and is very hard, it is widely used in construction as building materials.',
        resourceBonus: 2,
      },
      {
        id: 't1-q2',
        type: 'mcq',
        title: 'Jenny’s Plastic-Bag Soil Experiment & HK Rocks',
        prompt:
          'Jenny sealed some soil inside a transparent plastic bag under the Sun, and water droplets soon appeared inside the bag. What did she prove, AND what is true about most Hong Kong rocks?',
        options: [
          'Soil contains water; about 85% of Hong Kong’s rocks (e.g. Lantau Peak & Ma On Shan) are igneous rocks',
          'Sunlight turns sand into magma; 85% of Hong Kong rocks are formed under high pressure',
          'Soil contains only air; granite has finer grains than sandstone',
          'Plastic bags create minerals; Hong Kong has no igneous rocks',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Leaving soil in a sealed bag in the Sun traps water vapour that condenses into droplets — and remember HK Revision p.22!',
        explanation:
          'Jenny’s experiment proves soil contains water (along with rock particles, air, minerals, and humus). In Hong Kong, igneous rocks cover ~85% of the land (such as Lantau Peak and Ma On Shan).',
        resourceBonus: 2,
      },
      {
        id: 't1-q3',
        type: 'classify',
        title: 'Earth Crust, Mantle & Rock Misconception Check',
        prompt:
          'Inspect these statements from 小時鐘 Topic 1 & Revision and sort them into TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Science Fact',
            color: '#16a34a',
            description: 'Matches P4 Earth structure & rock facts',
          },
          {
            id: 'false',
            label: 'Common Misconception',
            color: '#dc2626',
            description: 'Contains a mistake to fix',
          },
        ],
        items: [
          {
            id: 't1-c1',
            label: 'Magma is located in the mantle, which is NOT completely liquid',
            emoji: '🌋',
            correctCategory: 'true',
          },
          {
            id: 't1-c2',
            label: 'Parts of the Earth’s crust are covered by ocean and river water',
            emoji: '🌊',
            correctCategory: 'true',
          },
          {
            id: 't1-c3',
            label: 'The Earth’s crust is divided into only 4 plates and contains magma',
            emoji: '🧩',
            correctCategory: 'false',
          },
          {
            id: 't1-c4',
            label: 'Sandstone particles are larger than granite particles',
            emoji: '🏜️',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: The crust is broken into MANY tectonic plates (not just 4!), magma sits in the mantle, and granite has larger grains than sandstone!',
        explanation:
          'The crust is divided into many tectonic plates, parts of which sit under oceans. Hot magma lies in the mantle (which is partly solid, not completely liquid), and igneous granite has larger grains than sandstone.',
        resourceBonus: 2,
      },
      {
        id: 't1-q4',
        type: 'sequence',
        title: 'Journey to the Centre of the Earth',
        prompt:
          'Arrange the layers of the Earth from the outermost layer (where we live) to the innermost centre:',
        items: [
          { id: 'mantle', label: 'Mantle (Hot Flowing Magma)', emoji: '🔥' },
          { id: 'crust', label: 'Crust (Rocks & Tectonic Plates)', emoji: '🏔️' },
          { id: 'core', label: 'Core (Extremely Hot Metals)', emoji: '🟡' },
        ],
        correctOrder: ['crust', 'mantle', 'core'],
        hint: 'Sparky says: We walk on the solid rocky shell first, then pass magma before reaching the metal centre!',
        explanation:
          'The Earth has three main layers from outside to inside: Crust (rocky plates) → Mantle (hot flowing magma causing plates to move slowly) → Core (extremely hot centre made mainly of metals).',
        resourceBonus: 2,
      },
      {
        id: 't1-q5',
        type: 'classify',
        title: 'Hong Kong Rock Lab',
        prompt:
          'Sort each rock characteristic or example into how the rock is formed (Igneous, Sedimentary, or Metamorphic):',
        categories: [
          {
            id: 'igneous',
            label: 'Igneous Rock',
            color: '#ef4444',
            description: 'Cooled magma; 85% of HK land (e.g. Granite)',
          },
          {
            id: 'sedimentary',
            label: 'Sedimentary Rock',
            color: '#d97706',
            description: 'Layers of sand/soil at sea bottom (e.g. Sandstone)',
          },
          {
            id: 'metamorphic',
            label: 'Metamorphic Rock',
            color: '#6366f1',
            description: 'Changed by high heat & pressure (e.g. Marble)',
          },
        ],
        items: [
          { id: 'r1', label: 'Granite (black & white large grains, very hard)', emoji: '🪨', correctCategory: 'igneous' },
          { id: 'r2', label: 'Formed when magma cools and hardens', emoji: '🌋', correctCategory: 'igneous' },
          { id: 'r3', label: 'Sandstone & Shale (distinct colourful layers)', emoji: '🏜️', correctCategory: 'sedimentary' },
          { id: 'r4', label: 'Marble & Gneiss (dark & light silky layers)', emoji: '🏛️', correctCategory: 'metamorphic' },
        ],
        hint: 'Sparky says: Fred found a hard rock with black-and-white spots on the mountain — that is Granite (igneous)!',
        explanation:
          'Igneous rocks (granite, basalt) form from cooled magma. Sedimentary rocks (sandstone, shale) form from sedimentation layers. Metamorphic rocks (marble, gneiss) form under high temperature and pressure.',
        resourceBonus: 2,
      },
      {
        id: 't1-q6',
        type: 'sequence',
        title: 'Soil Drainage Capacity Challenge',
        prompt:
          'Order the three soil types by DRAINAGE CAPACITY from HIGHEST (drains fastest) to LOWEST (holds water most):',
        items: [
          { id: 'clay', label: 'Clay Soil (Smallest particles)', emoji: '🧱' },
          { id: 'sandy', label: 'Sandy Soil (Largest particles)', emoji: '🏖️' },
          { id: 'loam', label: 'Loam (Medium particles)', emoji: '🌱' },
        ],
        correctOrder: ['sandy', 'loam', 'clay'],
        hint: 'Sparky says: Larger rock particles leave bigger spaces for water to pass straight through!',
        explanation:
          'Particle size runs Clay → Loam → Sandy (smallest to largest). Therefore, drainage capacity from high to low is Sandy soil → Loam → Clay soil!',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 2,
    semester: 1,
    topicCode: 'Topic 2',
    title: 'About the Earth (II): Rotation & Revolution',
    subtitle: 'Day and night, torch sunlight angle, tilted axis, and seasons',
    mergedSource: '小時鐘 P4 Topic 2 + New Science 4A Unit 1 (Ch. 2 & Revision)',
    focusDomain: 'Earth & Space',
    biome: 'solar_orbit',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-2',
      name: 'Orbit Navigator',
      color: '#eab308',
      icon: '🌍',
    },
    rewardResource: {
      id: 'sun_crystal',
      name: 'Sun Crystal',
      color: '#facc15',
      accentColor: '#f59e0b',
      icon: '✨',
    },
    sparkyIntro:
      'Test the Torch Angle Experiment and match Sydney, Perth & Hong Kong across the spinning globe!',
    quests: [
      {
        id: 't2-q1',
        type: 'mcq',
        title: 'Torch Sunlight Simulation (Area A vs Area B)',
        prompt:
          'In the New Science 4A torch experiment, a torch shines STRAIGHT DOWN onto paper (Area A), then at a SLANTED angle from the same height (Area B). How do Area A and Area B compare?',
        options: [
          'Area A is smaller and more focused (higher temperature, like overhead summer sunlight); Area B is larger and less focused (lower temperature, like slanted winter sunlight)',
          'Area A is larger and cooler; Area B is smaller and hotter',
          'Both Area A and Area B cover the exact same size and temperature',
          'Slanted light makes the ground hotter than overhead light',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Shining a torch straight down concentrates all the light energy on one small bright spot!',
        explanation:
          'Overhead sunlight (Area A) focuses energy onto a smaller area, raising the temperature higher (summer). Slanted sunlight (Area B) spreads the same energy over a larger area, resulting in lower temperatures (winter).',
        resourceBonus: 2,
      },
      {
        id: 't2-q2',
        type: 'classify',
        title: 'World Cities Hemisphere & Orbit Checker',
        prompt:
          'Sort each city or Earth-movement claim from 小時鐘 Topic 2 into Northern Hemisphere, Southern Hemisphere, or False Myth:',
        categories: [
          {
            id: 'north',
            label: 'Northern Hemisphere',
            color: '#ef4444',
            description: 'Summer around July when N. Pole tilts toward Sun',
          },
          {
            id: 'south',
            label: 'Southern Hemisphere',
            color: '#10b981',
            description: 'Winter around July (opposite seasons to HK)',
          },
          {
            id: 'myth',
            label: 'Science Myth (False)',
            color: '#6366f1',
            description: 'Incorrect statement about Earth/Sun motion',
          },
        ],
        items: [
          { id: 't2-c1', label: 'Hong Kong & Beijing (hot summer in July–August)', emoji: '🇭🇰', correctCategory: 'north' },
          { id: 't2-c2', label: 'Sydney, Perth & Rio de Janeiro (cool winter in July)', emoji: '🇦🇺', correctCategory: 'south' },
          { id: 't2-c3', label: 'The Sun revolves around the Earth once every 24 hours', emoji: '🚫', correctCategory: 'myth' },
          { id: 't2-c4', label: 'Earth’s revolution takes exactly 365 days with no leap years', emoji: '📅', correctCategory: 'myth' },
        ],
        hint: 'Sparky says: Perth, Sydney, and Rio are south of the equator! And remember the EARTH rotates in ~24h and revolves around the Sun in ~365¼ days!',
        explanation:
          'Because Earth’s axis is tilted, Northern (Hong Kong, Beijing) and Southern (Sydney, Perth, Rio de Janeiro) hemispheres have opposite seasons. The Earth revolves around the Sun (~365.25 days, causing leap years) and rotates every ~24 hours.',
        resourceBonus: 2,
      },
      {
        id: 't2-q3',
        type: 'sequence',
        title: 'Time Cycles of Earth’s Motions',
        prompt:
          'Order these astronomical time periods from SHORTEST duration to LONGEST duration:',
        items: [
          { id: 'rev', label: '1 Full Revolution around the Sun (~365¼ days)', emoji: '🛸' },
          { id: 'leap', label: '1 Leap-Year Cycle (adds 1 extra day every 4 years)', emoji: '🗓️' },
          { id: 'rot', label: '1 Rotation on Tilted Axis (~24 hours / 1 day)', emoji: '🌍' },
          { id: 'common', label: '1 Common Calendar Year (365 days)', emoji: '📖' },
        ],
        correctOrder: ['rot', 'common', 'rev', 'leap'],
        hint: 'Sparky says: 24 hours < 365 days < 365¼ days < 4 years!',
        explanation:
          'Earth’s rotation takes ~24 hours. A common year is 365 days, slightly shorter than Earth’s actual revolution (~365¼ days). Those extra quarter-days add up to 1 extra day every 4 years (leap year)!',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't2-q1',
        type: 'mcq',
        title: 'Torch Sunlight Simulation (Area A vs Area B)',
        prompt:
          'In the New Science 4A torch experiment, a torch shines STRAIGHT DOWN onto paper (Area A), then at a SLANTED angle from the same height (Area B). How do Area A and Area B compare?',
        options: [
          'Area A is smaller and more focused (higher temperature, like overhead summer sunlight); Area B is larger and less focused (lower temperature, like slanted winter sunlight)',
          'Area A is larger and cooler; Area B is smaller and hotter',
          'Both Area A and Area B cover the exact same size and temperature',
          'Slanted light makes the ground hotter than overhead light',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Shining a torch straight down concentrates all the light energy on one small bright spot!',
        explanation:
          'Overhead sunlight (Area A) focuses energy onto a smaller area, raising the temperature higher (summer). Slanted sunlight (Area B) spreads the same energy over a larger area, resulting in lower temperatures (winter).',
        resourceBonus: 2,
      },
      {
        id: 't2-q2',
        type: 'classify',
        title: 'World Cities Hemisphere & Orbit Checker',
        prompt:
          'Sort each city or Earth-movement claim from 小時鐘 Topic 2 into Northern Hemisphere, Southern Hemisphere, or False Myth:',
        categories: [
          {
            id: 'north',
            label: 'Northern Hemisphere',
            color: '#ef4444',
            description: 'Summer around July when N. Pole tilts toward Sun',
          },
          {
            id: 'south',
            label: 'Southern Hemisphere',
            color: '#10b981',
            description: 'Winter around July (opposite seasons to HK)',
          },
          {
            id: 'myth',
            label: 'Science Myth (False)',
            color: '#6366f1',
            description: 'Incorrect statement about Earth/Sun motion',
          },
        ],
        items: [
          { id: 't2-c1', label: 'Hong Kong & Beijing (hot summer in July–August)', emoji: '🇭🇰', correctCategory: 'north' },
          { id: 't2-c2', label: 'Sydney, Perth & Rio de Janeiro (cool winter in July)', emoji: '🇦🇺', correctCategory: 'south' },
          { id: 't2-c3', label: 'The Sun revolves around the Earth once every 24 hours', emoji: '🚫', correctCategory: 'myth' },
          { id: 't2-c4', label: 'Earth’s revolution takes exactly 365 days with no leap years', emoji: '📅', correctCategory: 'myth' },
        ],
        hint: 'Sparky says: Perth, Sydney, and Rio are south of the equator! And remember the EARTH rotates in ~24h and revolves around the Sun in ~365¼ days!',
        explanation:
          'Because Earth’s axis is tilted, Northern (Hong Kong, Beijing) and Southern (Sydney, Perth, Rio de Janeiro) hemispheres have opposite seasons. The Earth revolves around the Sun (~365.25 days, causing leap years) and rotates every ~24 hours.',
        resourceBonus: 2,
      },
      {
        id: 't2-q3',
        type: 'sequence',
        title: 'Time Cycles of Earth’s Motions',
        prompt:
          'Order these astronomical time periods from SHORTEST duration to LONGEST duration:',
        items: [
          { id: 'rev', label: '1 Full Revolution around the Sun (~365¼ days)', emoji: '🛸' },
          { id: 'leap', label: '1 Leap-Year Cycle (adds 1 extra day every 4 years)', emoji: '🗓️' },
          { id: 'rot', label: '1 Rotation on Tilted Axis (~24 hours / 1 day)', emoji: '🌍' },
          { id: 'common', label: '1 Common Calendar Year (365 days)', emoji: '📖' },
        ],
        correctOrder: ['rot', 'common', 'rev', 'leap'],
        hint: 'Sparky says: 24 hours < 365 days < 365¼ days < 4 years!',
        explanation:
          'Earth’s rotation takes ~24 hours. A common year is 365 days, slightly shorter than Earth’s actual revolution (~365¼ days). Those extra quarter-days add up to 1 extra day every 4 years (leap year)!',
        resourceBonus: 2,
      },
      {
        id: 't2-q4',
        type: 'mcq',
        title: 'Day, Night & Shadows',
        prompt:
          'In the globe and light-bulb experiment, when Hong Kong is in the shade facing away from the light bulb, what time is it in Hong Kong and what causes the cycle of day and night?',
        options: [
          'Daytime; caused by the Earth revolving around the Sun in 365 days',
          'Nighttime; caused by the Earth rotating on its tilted axis every 24 hours',
          'Winter; caused by the Moon blocking sunlight',
          'Nighttime; caused by the Sun orbiting the Earth every 24 hours',
        ],
        correctIndex: 1,
        hint: 'Sparky says: The light bulb represents the Sun. Facing away means shade = night!',
        explanation:
          'The Earth rotates on its axis (passing through the North and South Poles) once every ~24 hours (1 day). The side facing the Sun has day, while the side facing away has night.',
        resourceBonus: 2,
      },
      {
        id: 't2-q5',
        type: 'mcq',
        title: 'Sunlight Angle & Four Seasons',
        prompt:
          'When the Northern Hemisphere tilts toward the Sun and receives overhead (more focused) sunlight, what is true about Hong Kong and Sydney (Australia)?',
        options: [
          'Hong Kong has summer (higher temperature); Sydney in the Southern Hemisphere has winter',
          'Both Hong Kong and Sydney have summer at the same time',
          'Hong Kong has winter; the equator has 6 months of darkness',
          'Shadows at noon are longest in summer because sunlight is slanted',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Hong Kong is in the Northern Hemisphere, while Perth, Rio de Janeiro, and Sydney are in the Southern Hemisphere!',
        explanation:
          'Because the Earth revolves around the Sun (~365.25 days) with a tilted axis, opposite hemispheres experience opposite seasons.',
        resourceBonus: 2,
      },
      {
        id: 't2-q6',
        type: 'classify',
        title: 'Equator & Rotation Fact Check',
        prompt:
          'Classify each statement about Earth movement as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Statement',
            color: '#16a34a',
            description: 'Scientifically accurate',
          },
          {
            id: 'false',
            label: 'False Statement',
            color: '#dc2626',
            description: 'Contains a science mistake',
          },
        ],
        items: [
          { id: 'e1', label: 'The equator divides Earth into Northern & Southern Hemispheres', emoji: '🧭', correctCategory: 'true' },
          { id: 'e2', label: 'At the equator, lengths of day and night are always equal', emoji: '⚖️', correctCategory: 'true' },
          { id: 'e3', label: 'The Earth takes 24 days to complete one rotation', emoji: '⏱️', correctCategory: 'false' },
          { id: 'e4', label: 'There is a leap year every 4 years because revolution takes ~365.25 days', emoji: '📅', correctCategory: 'true' },
        ],
        hint: 'Sparky says: Rotation takes 24 HOURS, not 24 days!',
        explanation:
          'Rotation takes ~24 hours. Revolution takes ~365 and a quarter days, so we add an extra day every 4 years. The equator always receives nearly overhead sunlight.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 3,
    semester: 1,
    topicCode: 'Topic 3',
    title: 'Weather & Climate on the Earth',
    subtitle: 'HK Observatory records, greenhouse gas sources, and city climates',
    mergedSource: '小時鐘 P4 Topic 3 + New Science 4A Unit 1 (Ch. 3 & Revision)',
    focusDomain: 'Earth & Space',
    biome: 'climate_ice',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-3',
      name: 'Climate Guardian',
      color: '#0284c7',
      icon: '🌡️',
    },
    rewardResource: {
      id: 'glacial_ice',
      name: 'Glacial Ice Cube',
      color: '#38bdf8',
      accentColor: '#bae6fd',
      icon: '🧊',
    },
    sparkyIntro:
      'Analyze the 1904–2023 Hong Kong Observatory records and cut carbon dioxide emissions to protect our glacier!',
    quests: [
      {
        id: 't3-q1',
        type: 'mcq',
        title: 'HK Observatory & Victoria Harbour Trends',
        prompt:
          'Hong Kong Observatory records (1904–2023) show very hot days (≥33°C, Very Hot Weather Warning) increased while cold days fell, and Victoria Harbour’s sea level rose sharply. What explains the rising sea level?',
        options: [
          'Continuous land reclamation in Victoria Harbour created extra ocean water',
          'Global warming melts LAND ice (glaciers/ice sheets) and warms ocean water, raising sea levels',
          'Melting floating sea ice cubes make sea levels rise sharply',
          'Fewer very hot days cooled the harbour water',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Remember Revision Part B — land reclamation narrows parts of the harbour, NOT global sea-level rise; melting LAND ice does!',
        explanation:
          'As Earth’s average temperature rises due to global warming, land ice melts into the sea and ocean water expands, causing sea levels at Victoria Harbour and worldwide to rise.',
        resourceBonus: 2,
      },
      {
        id: 't3-q2',
        type: 'classify',
        title: 'CO₂ Sources vs Low-Carbon Living',
        prompt:
          'Classify each human or natural activity from Ch.3 & Topic 3 by whether it INCREASES carbon dioxide / warming or REDUCES our carbon footprint:',
        categories: [
          {
            id: 'increase_co2',
            label: 'Increases CO₂ / Warming',
            color: '#ef4444',
            description: 'Releases greenhouse gases or removes trees',
          },
          {
            id: 'reduce_co2',
            label: 'Reduces Carbon Footprint',
            color: '#10b981',
            description: 'Saves energy and lowers emissions',
          },
        ],
        items: [
          { id: 't3-c1', label: 'Exhaust from motor vehicles, burning garbage & bushfires', emoji: '🚗', correctCategory: 'increase_co2' },
          { id: 't3-c2', label: 'Deforestation (cutting down trees) & burning coal', emoji: '🪓', correctCategory: 'increase_co2' },
          { id: 't3-c3', label: 'Walking or taking public transit instead of private cars', emoji: '🚇', correctCategory: 'reduce_co2' },
          { id: 't3-c4', label: 'Switching off unused appliances & avoiding food waste', emoji: '💡', correctCategory: 'reduce_co2' },
        ],
        hint: 'Sparky says: Cutting down forests means fewer trees absorb CO₂, while saving electricity and walking lower your carbon footprint!',
        explanation:
          'Vehicles, industrial emissions, burning garbage, bushfires, and deforestation raise atmospheric CO₂. Walking, taking transit, saving electricity, and cutting food/plastic waste shrink our carbon footprint.',
        resourceBonus: 2,
      },
      {
        id: 't3-q3',
        type: 'sequence',
        title: 'City Temperature Table Gradient',
        prompt:
          'Using our P4 monthly city temperature chart, order these 3 cities from COLDEST winter climate to HOTTEST year-round climate:',
        items: [
          { id: 'bkk', label: 'Bangkok (27–31°C all year; closest to equator, no 4 seasons)', emoji: '🌴' },
          { id: 'hrb', label: 'Harbin (−15°C in Jan–Mar; heavy snow & white Christmas)', emoji: '⛄' },
          { id: 'hk', label: 'Hong Kong (cool 15–19°C winter, hot 28–30°C summer)', emoji: '🏙️' },
        ],
        correctOrder: ['hrb', 'hk', 'bkk'],
        hint: 'Sparky says: Harbin freezes at −15°C, Hong Kong stays mild in winter, and Bangkok stays hot 27–31°C all year!',
        explanation:
          'Places closer to the equator receive stronger overhead sunlight all year: Harbin (high northern latitude, freezing winter) → Hong Kong (subtropical 4 seasons) → Bangkok (near equator, hot all year).',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't3-q1',
        type: 'mcq',
        title: 'HK Observatory & Victoria Harbour Trends',
        prompt:
          'Hong Kong Observatory records (1904–2023) show very hot days (≥33°C, Very Hot Weather Warning) increased while cold days fell, and Victoria Harbour’s sea level rose sharply. What explains the rising sea level?',
        options: [
          'Continuous land reclamation in Victoria Harbour created extra ocean water',
          'Global warming melts LAND ice (glaciers/ice sheets) and warms ocean water, raising sea levels',
          'Melting floating sea ice cubes make sea levels rise sharply',
          'Fewer very hot days cooled the harbour water',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Remember Revision Part B — land reclamation narrows parts of the harbour, NOT global sea-level rise; melting LAND ice does!',
        explanation:
          'As Earth’s average temperature rises due to global warming, land ice melts into the sea and ocean water expands, causing sea levels at Victoria Harbour and worldwide to rise.',
        resourceBonus: 2,
      },
      {
        id: 't3-q2',
        type: 'classify',
        title: 'CO₂ Sources vs Low-Carbon Living',
        prompt:
          'Classify each human or natural activity from Ch.3 & Topic 3 by whether it INCREASES carbon dioxide / warming or REDUCES our carbon footprint:',
        categories: [
          {
            id: 'increase_co2',
            label: 'Increases CO₂ / Warming',
            color: '#ef4444',
            description: 'Releases greenhouse gases or removes trees',
          },
          {
            id: 'reduce_co2',
            label: 'Reduces Carbon Footprint',
            color: '#10b981',
            description: 'Saves energy and lowers emissions',
          },
        ],
        items: [
          { id: 't3-c1', label: 'Exhaust from motor vehicles, burning garbage & bushfires', emoji: '🚗', correctCategory: 'increase_co2' },
          { id: 't3-c2', label: 'Deforestation (cutting down trees) & burning coal', emoji: '🪓', correctCategory: 'increase_co2' },
          { id: 't3-c3', label: 'Walking or taking public transit instead of private cars', emoji: '🚇', correctCategory: 'reduce_co2' },
          { id: 't3-c4', label: 'Switching off unused appliances & avoiding food waste', emoji: '💡', correctCategory: 'reduce_co2' },
        ],
        hint: 'Sparky says: Cutting down forests means fewer trees absorb CO₂, while saving electricity and walking lower your carbon footprint!',
        explanation:
          'Vehicles, industrial emissions, burning garbage, bushfires, and deforestation raise atmospheric CO₂. Walking, taking transit, saving electricity, and cutting food/plastic waste shrink our carbon footprint.',
        resourceBonus: 2,
      },
      {
        id: 't3-q3',
        type: 'sequence',
        title: 'City Temperature Table Gradient',
        prompt:
          'Using our P4 monthly city temperature chart, order these 3 cities from COLDEST winter climate to HOTTEST year-round climate:',
        items: [
          { id: 'bkk', label: 'Bangkok (27–31°C all year; closest to equator, no 4 seasons)', emoji: '🌴' },
          { id: 'hrb', label: 'Harbin (−15°C in Jan–Mar; heavy snow & white Christmas)', emoji: '⛄' },
          { id: 'hk', label: 'Hong Kong (cool 15–19°C winter, hot 28–30°C summer)', emoji: '🏙️' },
        ],
        correctOrder: ['hrb', 'hk', 'bkk'],
        hint: 'Sparky says: Harbin freezes at −15°C, Hong Kong stays mild in winter, and Bangkok stays hot 27–31°C all year!',
        explanation:
          'Places closer to the equator receive stronger overhead sunlight all year: Harbin (high northern latitude, freezing winter) → Hong Kong (subtropical 4 seasons) → Bangkok (near equator, hot all year).',
        resourceBonus: 2,
      },
      {
        id: 't3-q4',
        type: 'classify',
        title: 'World Cities Climate Explorer',
        prompt:
          'Match each city from our P4 data charts to its correct climate description:',
        categories: [
          {
            id: 'tropics',
            label: 'Near Equator (Hot All Year)',
            color: '#f59e0b',
            description: 'No 4 distinct seasons (27–31°C all year)',
          },
          {
            id: 'north_cold',
            label: 'High Northern Latitude',
            color: '#38bdf8',
            description: 'Huge temperature swing; snowy winter',
          },
          {
            id: 'south_opp',
            label: 'Southern Hemisphere',
            color: '#10b981',
            description: 'Coolest in Jul–Sep; opposite to Hong Kong',
          },
        ],
        items: [
          { id: 'c1', label: 'Bangkok / Kuala Lumpur (closest to equator)', emoji: '🌴', correctCategory: 'tropics' },
          { id: 'c2', label: 'Harbin (-15°C in Jan–Mar; best for white Christmas)', emoji: '❄️', correctCategory: 'north_cold' },
          { id: 'c3', label: 'Sydney / Canberra (warm Dec–Mar, cool Jul–Sep)', emoji: '🦘', correctCategory: 'south_opp' },
        ],
        hint: 'Sparky says: Weather is short-term atmospheric conditions; climate is the long-term average pattern!',
        explanation:
          'Bangkok and Kuala Lumpur stay hot without four distinct seasons. Harbin is far north with freezing winters. Sydney and Canberra have opposite seasons to Hong Kong.',
        resourceBonus: 2,
      },
      {
        id: 't3-q5',
        type: 'mcq',
        title: 'Melting Ice & Rising Sea Levels',
        prompt:
          'Which statement about global warming and climate change is TRUE?',
        options: [
          'Melting SEA ice causes sea levels to rise sharply',
          'Melting LAND ice (glaciers/ice sheets) from global warming causes sea levels to rise and leads to desertification',
          'Global warming only affects humans hundreds of years later',
          'Continuous land reclamation is the main cause of rising global temperatures',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Melting LAND ice adds new water to the oceans!',
        explanation:
          'Burning fossil fuels releases greenhouse gases like CO₂, trapping heat, melting land ice, raising sea levels, and causing desertification.',
        resourceBonus: 2,
      },
      {
        id: 't3-q6',
        type: 'mcq',
        title: 'Shrink Our Carbon Footprint!',
        prompt:
          'What is a "carbon footprint", and which set of actions best reduces it?',
        options: [
          'Footprints left in coal mines; burn more oil for electricity',
          'The amount of greenhouse gases produced by human activities; save energy, walk/take transit, and avoid single-use items',
          'The weight of snow in Antarctica; turn air-conditioners colder all day',
          'A type of igneous rock; use disposable plastic utensils daily',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Turning off unused appliances and avoiding food waste both cut carbon emissions!',
        explanation:
          'Carbon footprints measure greenhouse gases released by our daily activities. Saving electricity, walking, reducing food waste, and avoiding single-use utensils slow global warming.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 4,
    semester: 1,
    topicCode: 'Topic 4',
    title: 'Animals, Plants & the Environment',
    subtitle: 'Rainforest buttress roots & tendrils, seals, and HK wetland species',
    mergedSource: '小時鐘 P4 Topic 4 + New Science 4A Unit 2 (Ch. 4 & Revision)',
    focusDomain: 'Ecosystem Relationships',
    biome: 'biomes',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-4',
      name: 'Biome Ranger',
      color: '#16a34a',
      icon: '🌵',
    },
    rewardResource: {
      id: 'biome_timber',
      name: 'Rainforest Timber',
      color: '#22c55e',
      accentColor: '#854d0e',
      icon: '🪵',
    },
    sparkyIntro:
      'Inspect Tropical Rainforest Plant A & B, desert lizards, seals, and HK wetlands on Living Biome Island!',
    quests: [
      {
        id: 't4-q1',
        type: 'mcq',
        title: 'Rainforest Plant A (Buttress Roots) & Plant B (Tendrils)',
        prompt:
          'In the tropical rainforest workbook study, Plant A grows wide buttress roots above the ground, while Plant B uses tendrils to wrap around tall trees. What are their adaptations for?',
        options: [
          'Plant A’s buttress roots store water like a cactus; Plant B’s tendrils catch flying insects',
          'Plant A’s buttress roots support its tall heavy trunk; Plant B climbs upwards to get more sunlight',
          'Both plants grow deep under snow to stay warm',
          'Plant A’s roots reduce evaporation; Plant B avoids sunlight',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Rainforest trees grow very tall in shallow wet soil, so wide buttress roots steady the trunk — while smaller climbing plants race up toward sunlight!',
        explanation:
          'Buttress roots give strong physical support to huge rainforest trunks (they do NOT store water!). Climbing plants use tendrils to reach upper canopy sunlight.',
        resourceBonus: 2,
      },
      {
        id: 't4-q2',
        type: 'classify',
        title: 'P4 Revision Species-to-Biome Matcher',
        prompt:
          'Match each animal or plant from the New Science 4A Revision chart to its natural environment:',
        categories: [
          {
            id: 'rainforest',
            label: 'Tropical Rainforest',
            color: '#16a34a',
            description: 'Hot, humid, dense canopy; greatest biodiversity',
          },
          {
            id: 'grassland',
            label: 'Temperate Grassland',
            color: '#84cc16',
            description: 'Distinct rainy & dry seasons; wide grasslands',
          },
          {
            id: 'wetland',
            label: 'HK Wetland (Mai Po / Nam Sang Wai)',
            color: '#0ea5e9',
            description: 'Mudflats, mangroves & migratory stopovers',
          },
          {
            id: 'desert',
            label: 'Desert',
            color: '#f59e0b',
            description: 'Very dry, scorching days & cold nights',
          },
        ],
        items: [
          { id: 't4-c1', label: 'Tiger & Gorilla', emoji: '🦍', correctCategory: 'rainforest' },
          { id: 't4-c2', label: 'Antelope & Zebra', emoji: '🦓', correctCategory: 'grassland' },
          { id: 't4-c3', label: 'Black-faced spoonbill & Fiddler crab', emoji: '🦀', correctCategory: 'wetland' },
          { id: 't4-c4', label: 'African spurred tortoise & Desert lizard (burrows by day)', emoji: '🦎', correctCategory: 'desert' },
        ],
        hint: 'Sparky says: Antelopes and zebras roam grasslands; tigers and gorillas live in rainforests; HK’s Mai Po & Long Valley wetlands host black-faced spoonbills!',
        explanation:
          'Tigers & gorillas inhabit tropical rainforests; antelopes & zebras roam temperate grasslands; fiddler crabs & black-faced spoonbills live in wetlands (Mai Po, Long Valley, Nam Sang Wai, Deep Bay); desert lizards & spurred tortoises survive deserts.',
        resourceBonus: 2,
      },
      {
        id: 't4-q3',
        type: 'mcq',
        title: 'Seals, Polar Bears & Winter Migration',
        prompt:
          'How do seals and polar bears thrive in icy polar oceans, AND how do many birds survive freezing winter food shortages?',
        options: [
          'Seals have waterproof fur, thick fat & streamlined bodies; polar bears have broad paws to walk on snow & swim; many birds migrate south to warmer places',
          'Seals enter underground desert burrows; polar bears shed all fur in winter',
          'Polar bears store water in humps; all birds sleep underwater',
          'Seals use tendrils to climb icebergs; polar bears have narrow needle feet',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Broad paws spread weight on soft snow like snowshoes, and streamlined shapes help seals swim fast!',
        explanation:
          'Seals have streamlined bodies, waterproof fur, and thick fat layers for freezing water. Polar bears use broad paws for snow walking and swimming, while migratory birds fly south for winter food and warmth.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't4-q1',
        type: 'mcq',
        title: 'Rainforest Plant A (Buttress Roots) & Plant B (Tendrils)',
        prompt:
          'In the tropical rainforest workbook study, Plant A grows wide buttress roots above the ground, while Plant B uses tendrils to wrap around tall trees. What are their adaptations for?',
        options: [
          'Plant A’s buttress roots store water like a cactus; Plant B’s tendrils catch flying insects',
          'Plant A’s buttress roots support its tall heavy trunk; Plant B climbs upwards to get more sunlight',
          'Both plants grow deep under snow to stay warm',
          'Plant A’s roots reduce evaporation; Plant B avoids sunlight',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Rainforest trees grow very tall in shallow wet soil, so wide buttress roots steady the trunk — while smaller climbing plants race up toward sunlight!',
        explanation:
          'Buttress roots give strong physical support to huge rainforest trunks (they do NOT store water!). Climbing plants use tendrils to reach upper canopy sunlight.',
        resourceBonus: 2,
      },
      {
        id: 't4-q2',
        type: 'classify',
        title: 'P4 Revision Species-to-Biome Matcher',
        prompt:
          'Match each animal or plant from the New Science 4A Revision chart to its natural environment:',
        categories: [
          {
            id: 'rainforest',
            label: 'Tropical Rainforest',
            color: '#16a34a',
            description: 'Hot, humid, dense canopy; greatest biodiversity',
          },
          {
            id: 'grassland',
            label: 'Temperate Grassland',
            color: '#84cc16',
            description: 'Distinct rainy & dry seasons; wide grasslands',
          },
          {
            id: 'wetland',
            label: 'HK Wetland (Mai Po / Nam Sang Wai)',
            color: '#0ea5e9',
            description: 'Mudflats, mangroves & migratory stopovers',
          },
          {
            id: 'desert',
            label: 'Desert',
            color: '#f59e0b',
            description: 'Very dry, scorching days & cold nights',
          },
        ],
        items: [
          { id: 't4-c1', label: 'Tiger & Gorilla', emoji: '🦍', correctCategory: 'rainforest' },
          { id: 't4-c2', label: 'Antelope & Zebra', emoji: '🦓', correctCategory: 'grassland' },
          { id: 't4-c3', label: 'Black-faced spoonbill & Fiddler crab', emoji: '🦀', correctCategory: 'wetland' },
          { id: 't4-c4', label: 'African spurred tortoise & Desert lizard (burrows by day)', emoji: '🦎', correctCategory: 'desert' },
        ],
        hint: 'Sparky says: Antelopes and zebras roam grasslands; tigers and gorillas live in rainforests; HK’s Mai Po & Long Valley wetlands host black-faced spoonbills!',
        explanation:
          'Tigers & gorillas inhabit tropical rainforests; antelopes & zebras roam temperate grasslands; fiddler crabs & black-faced spoonbills live in wetlands (Mai Po, Long Valley, Nam Sang Wai, Deep Bay); desert lizards & spurred tortoises survive deserts.',
        resourceBonus: 2,
      },
      {
        id: 't4-q3',
        type: 'mcq',
        title: 'Seals, Polar Bears & Winter Migration',
        prompt:
          'How do seals and polar bears thrive in icy polar oceans, AND how do many birds survive freezing winter food shortages?',
        options: [
          'Seals have waterproof fur, thick fat & streamlined bodies; polar bears have broad paws to walk on snow & swim; many birds migrate south to warmer places',
          'Seals enter underground desert burrows; polar bears shed all fur in winter',
          'Polar bears store water in humps; all birds sleep underwater',
          'Seals use tendrils to climb icebergs; polar bears have narrow needle feet',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Broad paws spread weight on soft snow like snowshoes, and streamlined shapes help seals swim fast!',
        explanation:
          'Seals have streamlined bodies, waterproof fur, and thick fat layers for freezing water. Polar bears use broad paws for snow walking and swimming, while migratory birds fly south for winter food and warmth.',
        resourceBonus: 2,
      },
      {
        id: 't4-q4',
        type: 'classify',
        title: 'Biome Habitat Matcher',
        prompt:
          'Place each animal or plant adaptation into the natural environment where it helps them survive:',
        categories: [
          {
            id: 'polar',
            label: 'Polar Region',
            color: '#38bdf8',
            description: 'Very cold, covered in ice all year',
          },
          {
            id: 'desert',
            label: 'Desert',
            color: '#f59e0b',
            description: 'Dry, hot by day, cold at night',
          },
          {
            id: 'rainforest',
            label: 'Tropical Rainforest',
            color: '#16a34a',
            description: 'Hot, humid, greatest biodiversity',
          },
          {
            id: 'wetland',
            label: 'Wetland (e.g. Mai Po)',
            color: '#0ea5e9',
            description: 'Land-water boundary with mud & swamps',
          },
        ],
        items: [
          { id: 'b1', label: 'Thick fur & fat layer (Polar bear / Penguin)', emoji: '🐧', correctCategory: 'polar' },
          { id: 'b2', label: 'Hump storing FAT & needle cactus leaves', emoji: '🐪', correctCategory: 'desert' },
          { id: 'b3', label: 'Buttress roots & broad dark green leaves', emoji: '🌳', correctCategory: 'rainforest' },
          { id: 'b4', label: 'Black-faced spoonbill & Fiddler crab', emoji: '🦀', correctCategory: 'wetland' },
        ],
        hint: 'Sparky says: Camels store FAT (not water!) in their humps, and tropical rainforests have the most species!',
        explanation:
          'Polar animals use fat/thick fur to keep warm. Desert camels store fat in humps; cacti have needle leaves. Rainforest trees grow buttress roots; HK wetlands support migrating birds.',
        resourceBonus: 2,
      },
      {
        id: 't4-q5',
        type: 'mcq',
        title: 'Surviving Cold Winters & Hot Days',
        prompt:
          'How do hedgehogs and black bears survive scarce winter food, while jerboas and African spurred tortoises survive desert heat?',
        options: [
          'Hedgehogs migrate to Antarctica; tortoises grow thick fur',
          'Hedgehogs go into deep winter sleep (lowering heartbeat/breathing); jerboas hide in burrows by day and tortoises pull into hard shells to reduce water loss',
          'Bears eat desert cacti; jerboas climb tall rainforest trees',
          'All animals shed their skin and stop breathing completely',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Hedgehogs & bats enter deep winter sleep to save energy!',
        explanation:
          'Deep winter sleep lowers body temperature, breathing, and heartbeat to save energy. Jerboas hide in cool burrows by day and tortoises pull into hard shells to save water.',
        resourceBonus: 2,
      },
      {
        id: 't4-q6',
        type: 'mcq',
        title: 'Temperate Grasslands & HK Wetlands',
        prompt:
          'Why do temperate grassland plants have narrow leaves and wide-spreading roots, AND why are Hong Kong wetlands (like Mai Po) vital for birds?',
        options: [
          'Narrow leaves reduce water loss and wide roots absorb underground water; wetlands provide food, habitats, breeding grounds & resting stops for migratory birds',
          'Narrow leaves trap snow; wetlands are frozen deserts for penguins',
          'Broad leaves reduce sunlight; wetlands only grow cacti',
          'Grassland plants have no roots; birds dislike muddy water',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Grasslands have distinct rainy and dry seasons, so plants conserve water with narrow waxy leaves!',
        explanation:
          'Temperate grassland grasses have narrow, waxy leaves to reduce evaporation and deep/wide roots for water. HK wetlands provide habitats, food, breeding grounds, and migratory stopovers.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 5,
    semester: 1,
    topicCode: 'Topic 5',
    title: 'The Balance of Nature & Ecosystems',
    subtitle: 'Frog habitat ripple effects, food web analysis, and trophic numbers',
    mergedSource: '小時鐘 P4 Topic 5 + New Science 4A Unit 2 (Ch. 5 & Revision)',
    focusDomain: 'Ecosystem Relationships',
    biome: 'food_chain',
    timeLimitSeconds: 160,
    badge: {
      id: 'badge-topic-5',
      name: 'Ecosystem Protector',
      color: '#10b981',
      icon: '🦅',
    },
    rewardResource: {
      id: 'ecosystem_emerald',
      name: 'Ecosystem Emerald',
      color: '#10b981',
      accentColor: '#6ee7b7',
      icon: '💚',
    },
    sparkyIntro:
      'Ecosystem Alert! Solve the Frog Habitat Cascade and inspect the Revision Food Web before toxins spread!',
    quests: [
      {
        id: 't5-q1',
        type: 'mcq',
        title: 'Frog Habitat Destruction Cascade',
        prompt:
          'In the food chain Grass → Grasshopper → Frog → Snake → Eagle (小時鐘 Topic 5), if wetland destruction causes the FROG population to drop sharply, what happens to the others?',
        options: [
          'Grasshopper INCREASES, Grass DECREASES, Snake DECREASES, and Eagle DECREASES',
          'Grasshopper DECREASES, Grass INCREASES, and Snake INCREASES',
          'Only frogs disappear; nothing else in the food chain changes',
          'Eagles start eating grass directly so eagles increase',
        ],
        correctIndex: 0,
        hint: 'Sparky says: With fewer frogs eating grasshoppers, grasshoppers multiply and eat more grass — meanwhile snakes lose food, which starves eagles too!',
        explanation:
          'Every organism depends on others: fewer frogs → grasshoppers increase → more grass eaten (grass decreases). At the same time, fewer frogs mean less food for snakes (snakes decrease) and eagles (eagles decrease)!',
        resourceBonus: 3,
      },
      {
        id: 't5-q2',
        type: 'classify',
        title: 'Food Web Competition & Bioaccumulation Check',
        prompt:
          'In Revision p.18, "Plants → Flies → Lizards/Frogs → Snakes" and "Plants → Birds". Classify each ecosystem statement as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Ecology Fact',
            color: '#16a34a',
            description: 'Matches food webs & nature balance rules',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Misunderstands competition or predators',
          },
        ],
        items: [
          {
            id: 't5-c1',
            label: 'Plants also compete with each other for sunlight, water, nutrients & space',
            emoji: '🌱',
            correctCategory: 'true',
          },
          {
            id: 't5-c2',
            label: 'Heavy metals & microplastics build up along food chains all the way to humans',
            emoji: '🐟',
            correctCategory: 'true',
          },
          {
            id: 't5-c3',
            label: 'In that food web, snakes and birds compete directly with each other for food',
            emoji: '🐦',
            correctCategory: 'false',
          },
          {
            id: 't5-c4',
            label: 'Eliminating all meat-eating predators like lions keeps ecosystems healthier',
            emoji: '🦁',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: In that web, birds eat plants while snakes eat lizards/frogs — they do NOT compete! And predators prevent prey overpopulation!',
        explanation:
          'In the Revision food web, snakes and birds eat completely different foods so they do not compete. Plants compete for sunlight, water, nutrients, and space. Toxins bioaccumulate up food chains, and predators are essential for ecological balance.',
        resourceBonus: 3,
      },
      {
        id: 't5-q3',
        type: 'sequence',
        title: 'Trophic Pyramid: Largest to Fewest Count',
        prompt:
          'In a balanced grassland ecosystem, order the living things from LARGEST population number to FEWEST population number:',
        items: [
          { id: 'snakes', label: 'Snakes (Secondary meat-eating predators)', emoji: '🐍' },
          { id: 'grass', label: 'Grass (Producers using sunlight)', emoji: '🌿' },
          { id: 'eagles', label: 'Eagles (Top predators)', emoji: '🦅' },
          { id: 'hoppers', label: 'Grasshoppers & Rabbits (Plant-eating)', emoji: '🦗' },
        ],
        correctOrder: ['grass', 'hoppers', 'snakes', 'eagles'],
        hint: 'Sparky says: Producers sit at the wide bottom of the food pyramid with the largest number, while top predators are the fewest!',
        explanation:
          'To support an ecosystem, producers (grass) exist in the largest numbers, followed by plant-eating animals (grasshoppers/rabbits), then snakes, and finally the fewest top predators (eagles).',
        resourceBonus: 3,
      },
    ],
    questBank: [
      {
        id: 't5-q1',
        type: 'mcq',
        title: 'Frog Habitat Destruction Cascade',
        prompt:
          'In the food chain Grass → Grasshopper → Frog → Snake → Eagle (小時鐘 Topic 5), if wetland destruction causes the FROG population to drop sharply, what happens to the others?',
        options: [
          'Grasshopper INCREASES, Grass DECREASES, Snake DECREASES, and Eagle DECREASES',
          'Grasshopper DECREASES, Grass INCREASES, and Snake INCREASES',
          'Only frogs disappear; nothing else in the food chain changes',
          'Eagles start eating grass directly so eagles increase',
        ],
        correctIndex: 0,
        hint: 'Sparky says: With fewer frogs eating grasshoppers, grasshoppers multiply and eat more grass — meanwhile snakes lose food, which starves eagles too!',
        explanation:
          'Every organism depends on others: fewer frogs → grasshoppers increase → more grass eaten (grass decreases). At the same time, fewer frogs mean less food for snakes (snakes decrease) and eagles (eagles decrease)!',
        resourceBonus: 3,
      },
      {
        id: 't5-q2',
        type: 'classify',
        title: 'Food Web Competition & Bioaccumulation Check',
        prompt:
          'In Revision p.18, "Plants → Flies → Lizards/Frogs → Snakes" and "Plants → Birds". Classify each ecosystem statement as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Ecology Fact',
            color: '#16a34a',
            description: 'Matches food webs & nature balance rules',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Misunderstands competition or predators',
          },
        ],
        items: [
          {
            id: 't5-c1',
            label: 'Plants also compete with each other for sunlight, water, nutrients & space',
            emoji: '🌱',
            correctCategory: 'true',
          },
          {
            id: 't5-c2',
            label: 'Heavy metals & microplastics build up along food chains all the way to humans',
            emoji: '🐟',
            correctCategory: 'true',
          },
          {
            id: 't5-c3',
            label: 'In that food web, snakes and birds compete directly with each other for food',
            emoji: '🐦',
            correctCategory: 'false',
          },
          {
            id: 't5-c4',
            label: 'Eliminating all meat-eating predators like lions keeps ecosystems healthier',
            emoji: '🦁',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: In that web, birds eat plants while snakes eat lizards/frogs — they do NOT compete! And predators prevent prey overpopulation!',
        explanation:
          'In the Revision food web, snakes and birds eat completely different foods so they do not compete. Plants compete for sunlight, water, nutrients, and space. Toxins bioaccumulate up food chains, and predators are essential for ecological balance.',
        resourceBonus: 3,
      },
      {
        id: 't5-q3',
        type: 'sequence',
        title: 'Trophic Pyramid: Largest to Fewest Count',
        prompt:
          'In a balanced grassland ecosystem, order the living things from LARGEST population number to FEWEST population number:',
        items: [
          { id: 'snakes', label: 'Snakes (Secondary meat-eating predators)', emoji: '🐍' },
          { id: 'grass', label: 'Grass (Producers using sunlight)', emoji: '🌿' },
          { id: 'eagles', label: 'Eagles (Top predators)', emoji: '🦅' },
          { id: 'hoppers', label: 'Grasshoppers & Rabbits (Plant-eating)', emoji: '🦗' },
        ],
        correctOrder: ['grass', 'hoppers', 'snakes', 'eagles'],
        hint: 'Sparky says: Producers sit at the wide bottom of the food pyramid with the largest number, while top predators are the fewest!',
        explanation:
          'To support an ecosystem, producers (grass) exist in the largest numbers, followed by plant-eating animals (grasshoppers/rabbits), then snakes, and finally the fewest top predators (eagles).',
        resourceBonus: 3,
      },
      {
        id: 't5-q4',
        type: 'sequence',
        title: 'Ecosystem Puzzle: Forest Food Chain Builder',
        prompt:
          'Build the correct forest food chain from PRODUCER (makes food from Sunlight) to TOP PREDATOR (each arrow means "eaten by"):',
        items: [
          { id: 'snake', label: 'Snake (Meat-eating)', emoji: '🐍' },
          { id: 'grass', label: 'Grass (Producer)', emoji: '🌿' },
          { id: 'eagle', label: 'Eagle (Top Predator)', emoji: '🦅' },
          { id: 'rabbit', label: 'Rabbit (Plant-eating)', emoji: '🐇' },
        ],
        correctOrder: ['grass', 'rabbit', 'snake', 'eagle'],
        hint: 'Sparky says: Every food chain starts with a Producer (plants) that makes its own food using sunlight!',
        explanation:
          'Producers (grass) use sunlight to make food and exist in the largest numbers. They are eaten by rabbits → snakes → eagles.',
        resourceBonus: 3,
      },
      {
        id: 't5-q5',
        type: 'sequence',
        title: 'Ecosystem Puzzle: Ocean Food Chain Builder',
        prompt:
          'Assemble the Ocean Food Chain in the correct feeding order ("eaten by"):',
        items: [
          { id: 'squid', label: 'Squid', emoji: '🦑' },
          { id: 'shrimp', label: 'Small Shrimp', emoji: '🦐' },
          { id: 'shark', label: 'Shark', emoji: '🦈' },
          { id: 'phyto', label: 'Floating Plants (Seaweed/Plankton)', emoji: '🌱' },
        ],
        correctOrder: ['phyto', 'shrimp', 'squid', 'shark'],
        hint: 'Sparky says: Seaweed and floating plants are the ocean producers at the very start!',
        explanation:
          'In the ocean: Floating plants (producers) → Small shrimp → Squid → Shark!',
        resourceBonus: 3,
      },
      {
        id: 't5-q6',
        type: 'classify',
        title: 'Ecosystem Balance & Diet Classifier',
        prompt:
          'Classify each living thing into its correct ecological role:',
        categories: [
          {
            id: 'producer',
            label: 'Producer',
            color: '#22c55e',
            description: 'Makes own food from Sun; largest count',
          },
          {
            id: 'herbivore',
            label: 'Plant-eating Animal',
            color: '#84cc16',
            description: 'Eats plants (e.g. deer, giraffe, elephant)',
          },
          {
            id: 'omnivore',
            label: 'Plant-and-meat-eating',
            color: '#f59e0b',
            description: 'Eats both plants & animals (e.g. bear, rat, raccoon)',
          },
          {
            id: 'carnivore',
            label: 'Meat-eating Predator',
            color: '#ef4444',
            description: 'Hunts animals; fewest in food chain',
          },
        ],
        items: [
          { id: 'd1', label: 'Grass & Floating Plants', emoji: '🌾', correctCategory: 'producer' },
          { id: 'd2', label: 'Giraffe, Deer & Elephant', emoji: '🦒', correctCategory: 'herbivore' },
          { id: 'd3', label: 'Bear, Rat & Raccoon', emoji: '🐻', correctCategory: 'omnivore' },
          { id: 'd4', label: 'Lion, Tiger & Spider', emoji: '🦁', correctCategory: 'carnivore' },
        ],
        hint: 'Sparky says: Every organism helps maintain ecological balance — report illegal tree cutting and never feed wildlife!',
        explanation:
          'Producers make food from sunlight; herbivores eat plants; omnivores eat both; carnivores hunt animals. All roles keep nature balanced.',
        resourceBonus: 3,
      },
    ],
  },
  {
    id: 6,
    semester: 1,
    topicCode: 'Topic 6',
    title: 'Reproduction & Heredity of Plants & Animals',
    subtitle: 'Vegetative parts, seed counts, hybrid rice, and morning glory genetics',
    mergedSource: '小時鐘 P4 Topic 6 + New Science 4A Unit 3 (Ch. 6 & Ch. 7)',
    focusDomain: 'Cellular Biology',
    biome: 'botanical',
    timeLimitSeconds: 160,
    badge: {
      id: 'badge-topic-6',
      name: 'Life Cycle Master',
      color: '#ec4899',
      icon: '🌸',
    },
    rewardResource: {
      id: 'pollination_seed',
      name: 'Golden Pollen Seed',
      color: '#f472b6',
      accentColor: '#fde047',
      icon: '🌻',
    },
    sparkyIntro:
      'Explore sweet potato roots, dragon fruit seeds, Yuan Longping’s hybrid rice, and morning glory heredity!',
    quests: [
      {
        id: 't6-q1',
        type: 'classify',
        title: 'Plant Parts & Seed Dispersal Methods',
        prompt:
          'Sort each plant from New Science 4A Ch.6 & 小時鐘 Topic 6 into how it reproduces or disperses its seeds:',
        categories: [
          {
            id: 'veg',
            label: 'Vegetative Part (No Seed)',
            color: '#10b981',
            description: 'Grows new plants from roots, stems, or leaves',
          },
          {
            id: 'wind_water',
            label: 'Wind or Water Dispersal',
            color: '#0ea5e9',
            description: 'Light/fluffy in air or floats on water',
          },
          {
            id: 'self_animal',
            label: 'Own Force or Animals',
            color: '#f59e0b',
            description: 'Pods burst open or animals carry/eat fruit',
          },
        ],
        items: [
          { id: 't6-c1', label: 'Sweet potato (roots), Potato (stems) & African violet (leaves)', emoji: '🍠', correctCategory: 'veg' },
          { id: 't6-c2', label: 'Dandelion & Tree cotton (light/fluffy) + Coconut & Water lily (floats)', emoji: '🌬️', correctCategory: 'wind_water' },
          { id: 't6-c3', label: 'Pea & White popinac (pods burst by own force)', emoji: '🫛', correctCategory: 'self_animal' },
          { id: 't6-c4', label: 'Longan & Lychee (sweet fruit attracts animals)', emoji: '🍒', correctCategory: 'self_animal' },
        ],
        hint: 'Sparky says: Not all plants grow only from seeds — sweet potatoes use roots, potatoes use stems, and cacti/African violets can grow from leaves!',
        explanation:
          'Some plants reproduce via roots (sweet potato), stems (potato), or leaves (African violet, cactus). Seed dispersal uses wind (dandelion, tree cotton), water (coconut, water lily), animals (longan), or own force (pea, white popinac).',
        resourceBonus: 3,
      },
      {
        id: 't6-q2',
        type: 'mcq',
        title: 'Seed Numbers & Yuan Longping’s Hybrid Rice',
        prompt:
          'Which fruits contain MANY seeds inside a single fruit (unlike lychee & mango), AND how did scientist Yuan Longping help solve food shortages?',
        options: [
          'Dragon fruit, kiwi & papaya have many seeds; Yuan Longping used plant heredity to breed high-yield hybrid rice',
          'Lychee, mango & cherry have hundreds of seeds per fruit; Yuan Longping bred square watermelons',
          'Dragon fruit has only 1 giant seed; hybrid rice needs no sunlight',
          'Only plants with 1 seed can inherit traits from parent plants',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Cut open a dragon fruit, kiwi, or papaya to spot hundreds of tiny seeds — and remember Ch.7’s hybrid rice hero!',
        explanation:
          'Dragon fruit, kiwi, and papaya pack many tiny seeds inside one fruit (whereas mango, peach, and lychee hold 1 seed per fruit). Yuan Longping applied genetics/heredity to cross-breed high-yield hybrid rice.',
        resourceBonus: 3,
      },
      {
        id: 't6-q3',
        type: 'mcq',
        title: 'Morning Glory Traits & Animal Parental Care',
        prompt:
          'In the morning glory family, heart-shaped leaves and purple flower colours pass to offspring. Which human traits are ALSO inherited, AND how do mother hens & polar bears care for young?',
        options: [
          'Language, hairstyle & swimming are inherited; hens leave eggs alone and polar bears never teach hunting',
          'Eye colour, earlobe shape & tongue rolling are inherited; mother hens warm & guard eggs while polar bears protect cubs and teach them to hunt',
          'Body weight is strictly inherited; polar bears lay eggs in nests',
          'Only animals show heredity; plants never pass traits to offspring',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Both plants AND animals pass genetic traits to offspring — while swimming, language, and hairstyle are learned/environmental!',
        explanation:
          'Eye colour, eyelids, earlobes, tongue rolling, and leaf/flower shapes are inherited. Mother hens sit on eggs to keep them warm and guard them, while polar bears nurse cubs and teach them to hunt.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't6-q1',
        type: 'classify',
        title: 'Plant Parts & Seed Dispersal Methods',
        prompt:
          'Sort each plant from New Science 4A Ch.6 & 小時鐘 Topic 6 into how it reproduces or disperses its seeds:',
        categories: [
          {
            id: 'veg',
            label: 'Vegetative Part (No Seed)',
            color: '#10b981',
            description: 'Grows new plants from roots, stems, or leaves',
          },
          {
            id: 'wind_water',
            label: 'Wind or Water Dispersal',
            color: '#0ea5e9',
            description: 'Light/fluffy in air or floats on water',
          },
          {
            id: 'self_animal',
            label: 'Own Force or Animals',
            color: '#f59e0b',
            description: 'Pods burst open or animals carry/eat fruit',
          },
        ],
        items: [
          { id: 't6-c1', label: 'Sweet potato (roots), Potato (stems) & African violet (leaves)', emoji: '🍠', correctCategory: 'veg' },
          { id: 't6-c2', label: 'Dandelion & Tree cotton (light/fluffy) + Coconut & Water lily (floats)', emoji: '🌬️', correctCategory: 'wind_water' },
          { id: 't6-c3', label: 'Pea & White popinac (pods burst by own force)', emoji: '🫛', correctCategory: 'self_animal' },
          { id: 't6-c4', label: 'Longan & Lychee (sweet fruit attracts animals)', emoji: '🍒', correctCategory: 'self_animal' },
        ],
        hint: 'Sparky says: Not all plants grow only from seeds — sweet potatoes use roots, potatoes use stems, and cacti/African violets can grow from leaves!',
        explanation:
          'Some plants reproduce via roots (sweet potato), stems (potato), or leaves (African violet, cactus). Seed dispersal uses wind (dandelion, tree cotton), water (coconut, water lily), animals (longan), or own force (pea, white popinac).',
        resourceBonus: 3,
      },
      {
        id: 't6-q2',
        type: 'mcq',
        title: 'Seed Numbers & Yuan Longping’s Hybrid Rice',
        prompt:
          'Which fruits contain MANY seeds inside a single fruit (unlike lychee & mango), AND how did scientist Yuan Longping help solve food shortages?',
        options: [
          'Dragon fruit, kiwi & papaya have many seeds; Yuan Longping used plant heredity to breed high-yield hybrid rice',
          'Lychee, mango & cherry have hundreds of seeds per fruit; Yuan Longping bred square watermelons',
          'Dragon fruit has only 1 giant seed; hybrid rice needs no sunlight',
          'Only plants with 1 seed can inherit traits from parent plants',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Cut open a dragon fruit, kiwi, or papaya to spot hundreds of tiny seeds — and remember Ch.7’s hybrid rice hero!',
        explanation:
          'Dragon fruit, kiwi, and papaya pack many tiny seeds inside one fruit (whereas mango, peach, and lychee hold 1 seed per fruit). Yuan Longping applied genetics/heredity to cross-breed high-yield hybrid rice.',
        resourceBonus: 3,
      },
      {
        id: 't6-q3',
        type: 'mcq',
        title: 'Morning Glory Traits & Animal Parental Care',
        prompt:
          'In the morning glory family, heart-shaped leaves and purple flower colours pass to offspring. Which human traits are ALSO inherited, AND how do mother hens & polar bears care for young?',
        options: [
          'Language, hairstyle & swimming are inherited; hens leave eggs alone and polar bears never teach hunting',
          'Eye colour, earlobe shape & tongue rolling are inherited; mother hens warm & guard eggs while polar bears protect cubs and teach them to hunt',
          'Body weight is strictly inherited; polar bears lay eggs in nests',
          'Only animals show heredity; plants never pass traits to offspring',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Both plants AND animals pass genetic traits to offspring — while swimming, language, and hairstyle are learned/environmental!',
        explanation:
          'Eye colour, eyelids, earlobes, tongue rolling, and leaf/flower shapes are inherited. Mother hens sit on eggs to keep them warm and guard them, while polar bears nurse cubs and teach them to hunt.',
        resourceBonus: 2,
      },
      {
        id: 't6-q4',
        type: 'sequence',
        title: 'Flowering Plant Reproduction Cycle',
        prompt:
          'Arrange the flowering plant reproduction steps from Pollination to a New Plant:',
        items: [
          { id: 'fruit', label: 'Other petals wilt; ovary develops into a fruit with seeds', emoji: '🍑' },
          { id: 'pollination', label: 'Insects/wind carry pollen from stamen to pistil', emoji: '🐝' },
          { id: 'sprout', label: 'Seeds disperse, fall in good soil, and sprout into a seedling', emoji: '🌱' },
          { id: 'fertilization', label: 'Pollen enters the ovary and fertilization occurs', emoji: '🧬' },
        ],
        correctOrder: ['pollination', 'fertilization', 'fruit', 'sprout'],
        hint: 'Sparky says: Pollination happens first, then fertilization inside the ovary, then fruit & seeds, then sprouting!',
        explanation:
          'Sequence: Pollination → Fertilization in ovary → Ovary becomes fruit containing seeds → Seed dispersal → Seedling!',
        resourceBonus: 3,
      },
      {
        id: 't6-q5',
        type: 'classify',
        title: 'Genetics: Inherited vs Learned Traits',
        prompt:
          'Sort each human characteristic into INHERITED (passed from parents via genes) or LEARNED / ENVIRONMENTAL:',
        categories: [
          {
            id: 'inherited',
            label: 'Inherited from Parents',
            color: '#8b5cf6',
            description: 'Determined by genes; cannot be changed by practice',
          },
          {
            id: 'learned',
            label: 'Learned / Environmental',
            color: '#06b6d4',
            description: 'Developed by learning, practice, or lifestyle',
          },
        ],
        items: [
          { id: 'g1', label: 'Ability to roll the tongue & attached/detached earlobes', emoji: '👅', correctCategory: 'inherited' },
          { id: 'g2', label: 'Eye colour, double/single eyelids & bending thumb backward', emoji: '👁️', correctCategory: 'inherited' },
          { id: 'g3', label: 'Language spoken, swimming & playing music/sports', emoji: '🎻', correctCategory: 'learned' },
          { id: 'g4', label: 'Hairstyle & body weight', emoji: '💇', correctCategory: 'learned' },
        ],
        hint: 'Sparky says: Inherited features come from genes, while skills and hairstyles come from practice or choice!',
        explanation:
          'Inherited traits (eye colour, eyelids, earlobes, tongue rolling, thumb bending) come from genes. Music, sports, language, hairstyle, and weight can be learned or changed.',
        resourceBonus: 3,
      },
      {
        id: 't6-q6',
        type: 'classify',
        title: 'Animal Reproduction & Parental Care',
        prompt:
          'Match each animal reproductive strategy to how it protects its offspring:',
        categories: [
          {
            id: 'egg_care',
            label: 'Egg-laying + Egg Protection',
            color: '#f59e0b',
            description: 'Eggs develop outside mother; many eggs or guarded',
          },
          {
            id: 'live_care',
            label: 'Live-bearing + Raising Young',
            color: '#ec4899',
            description: 'Develop inside mother; fed milk & taught survival',
          },
        ],
        items: [
          { id: 'a1', label: 'Male seahorse (pouch) & King penguin (carries egg on feet)', emoji: '🐧', correctCategory: 'egg_care' },
          { id: 'a2', label: 'Male midwife toad (eggs on back legs) & Birds (nest)', emoji: '🐸', correctCategory: 'egg_care' },
          { id: 'a3', label: 'Humans & Pigs (nurture in body, feed milk, teach survival)', emoji: '🐷', correctCategory: 'live_care' },
        ],
        hint: 'Sparky says: Egg-laying animals lay more eggs because eggs outside the body face predators and hazards!',
        explanation:
          'Live-bearing mammals nurture babies inside the mother for higher survival, then feed milk. Egg-laying animals lay many eggs or guard them.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 7,
    semester: 1,
    topicCode: 'Topic 7',
    title: 'Infectious & Non-infectious Diseases & Cell Biology',
    subtitle: 'Blood clots, cancer risk factors, daily hygiene habits & HK pandemic tech',
    mergedSource: '小時鐘 P4 Topic 7 + New Science 4A Unit 4 (Ch. 8 & Revision)',
    focusDomain: 'Cellular Biology',
    biome: 'cellular_lab',
    timeLimitSeconds: 165,
    badge: {
      id: 'badge-topic-7',
      name: 'Cellular Defender',
      color: '#e11d48',
      icon: '🧬',
    },
    rewardResource: {
      id: 'immune_shield',
      name: 'Immune Cell Shield',
      color: '#fb7185',
      accentColor: '#38bdf8',
      icon: '🛡️',
    },
    sparkyIntro:
      'Shrink into the Cellular Lab! Check coronary blood clots, judge daily hygiene habits, and track HK disease data!',
    quests: [
      {
        id: 't7-q1',
        type: 'mcq',
        title: 'Blood Clots & Top Non-infectious Risks',
        prompt:
          'How do fatty deposits in blood vessels trigger sudden heart death, AND which habits raise the risk of cancer (one of Hong Kong’s top causes of death alongside heart disease & stroke)?',
        options: [
          'Fatty deposits narrow vessels (chest pain) and can break to form blood clots blocking heart blood flow; smoking, obesity, alcohol & processed meat raise cancer risk',
          'Food poisoning and dengue fever are the top causes of death in Hong Kong; blood clots help heart cells breathe',
          'Fatty deposits only come from coughing droplets; wearing a mask prevents cancer',
          'Cancer cells divide slowly under strict control and are spread by mosquitoes',
        ],
        correctIndex: 0,
        hint: 'Sparky says: When cholesterol/fatty deposits break loose, they form BLOOD CLOTS that starve heart muscle cells of oxygen!',
        explanation:
          'Fatty deposits narrow blood vessels causing chest pain and can break apart to form blood clots, leading to heart attacks. Cancer (uncontrolled abnormal cell division), heart disease, and stroke are major causes of death in Hong Kong.',
        resourceBonus: 3,
      },
      {
        id: 't7-q2',
        type: 'classify',
        title: 'Daily Health & Hygiene Habit Judge',
        prompt:
          'Judge these everyday actions from New Science 4A Ch.8 & 小時鐘 Topic 7 as GOOD Prevention Habits or RISKY Habits:',
        categories: [
          {
            id: 'good',
            label: 'Good Prevention Habit',
            color: '#10b981',
            description: 'Blocks pathogens or lowers chronic disease risk',
          },
          {
            id: 'risky',
            label: 'Risky Habit (Fix It!)',
            color: '#e11d48',
            description: 'Spreads germs, breeds vectors, or harms cells',
          },
        ],
        items: [
          { id: 't7-c1', label: 'Covering nose & mouth when sneezing and using hand sanitiser', emoji: '🧴', correctCategory: 'good' },
          { id: 't7-c2', label: 'Wearing anti-mosquito patches & getting seasonal flu vaccines', emoji: '💉', correctCategory: 'good' },
          { id: 't7-c3', label: 'Rubbing eyes with unwashed hands after touching handrails', emoji: '🚫', correctCategory: 'risky' },
          { id: 't7-c4', label: 'Leaving stagnant water in flowerpots & eating lots of processed meat', emoji: '🦟', correctCategory: 'risky' },
        ],
        hint: 'Sparky says: Mosquitoes breed in stagnant flowerpot water (spreading Dengue/Chikungunya), and unwashed hands carry viruses to eyes/mouth!',
        explanation:
          'Covering sneezes, washing/sanitising hands, clearing stagnant water, getting vaccinated, and eating balanced meals protect both our immune system and body cells.',
        resourceBonus: 3,
      },
      {
        id: 't7-q3',
        type: 'mcq',
        title: 'COVID-19 Symptoms, Cancer Clues & HK Pandemic Tech',
        prompt:
          'Compare symptoms and prevention: what distinguishes COVID-19 from cancer, AND how did Hong Kong use technology to fight COVID-19?',
        options: [
          'COVID-19 causes hard body lumps and is prevented by not eating processed meat; HK banned thermometers',
          'COVID-19 causes fever, sore throat & fatigue (monitored by border temperature screening, sewage tests, vaccination & mobile apps); cancer shows lumps & unexplained weight loss and is non-infectious',
          'Both COVID-19 and cancer spread via blood transfusions from mosquitoes',
          'Sewage testing only checks for iron rust in water pipes',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Remember Ch.8 — HKSAR used temperature screening at control points, sewage surveillance, vaccination programmes & mobile apps!',
        explanation:
          'COVID-19 is an infectious viral disease (fever, sore throat, cough, fatigue) tracked via border temperature checks, sewage tests, vaccination, and mobile apps. Cancer is non-infectious (abnormal cells forming lumps, unexplained weight loss/fatigue).',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't7-q1',
        type: 'mcq',
        title: 'Blood Clots & Top Non-infectious Risks',
        prompt:
          'How do fatty deposits in blood vessels trigger sudden heart death, AND which habits raise the risk of cancer (one of Hong Kong’s top causes of death alongside heart disease & stroke)?',
        options: [
          'Fatty deposits narrow vessels (chest pain) and can break to form blood clots blocking heart blood flow; smoking, obesity, alcohol & processed meat raise cancer risk',
          'Food poisoning and dengue fever are the top causes of death in Hong Kong; blood clots help heart cells breathe',
          'Fatty deposits only come from coughing droplets; wearing a mask prevents cancer',
          'Cancer cells divide slowly under strict control and are spread by mosquitoes',
        ],
        correctIndex: 0,
        hint: 'Sparky says: When cholesterol/fatty deposits break loose, they form BLOOD CLOTS that starve heart muscle cells of oxygen!',
        explanation:
          'Fatty deposits narrow blood vessels causing chest pain and can break apart to form blood clots, leading to heart attacks. Cancer (uncontrolled abnormal cell division), heart disease, and stroke are major causes of death in Hong Kong.',
        resourceBonus: 3,
      },
      {
        id: 't7-q2',
        type: 'classify',
        title: 'Daily Health & Hygiene Habit Judge',
        prompt:
          'Judge these everyday actions from New Science 4A Ch.8 & 小時鐘 Topic 7 as GOOD Prevention Habits or RISKY Habits:',
        categories: [
          {
            id: 'good',
            label: 'Good Prevention Habit',
            color: '#10b981',
            description: 'Blocks pathogens or lowers chronic disease risk',
          },
          {
            id: 'risky',
            label: 'Risky Habit (Fix It!)',
            color: '#e11d48',
            description: 'Spreads germs, breeds vectors, or harms cells',
          },
        ],
        items: [
          { id: 't7-c1', label: 'Covering nose & mouth when sneezing and using hand sanitiser', emoji: '🧴', correctCategory: 'good' },
          { id: 't7-c2', label: 'Wearing anti-mosquito patches & getting seasonal flu vaccines', emoji: '💉', correctCategory: 'good' },
          { id: 't7-c3', label: 'Rubbing eyes with unwashed hands after touching handrails', emoji: '🚫', correctCategory: 'risky' },
          { id: 't7-c4', label: 'Leaving stagnant water in flowerpots & eating lots of processed meat', emoji: '🦟', correctCategory: 'risky' },
        ],
        hint: 'Sparky says: Mosquitoes breed in stagnant flowerpot water (spreading Dengue/Chikungunya), and unwashed hands carry viruses to eyes/mouth!',
        explanation:
          'Covering sneezes, washing/sanitising hands, clearing stagnant water, getting vaccinated, and eating balanced meals protect both our immune system and body cells.',
        resourceBonus: 3,
      },
      {
        id: 't7-q3',
        type: 'mcq',
        title: 'COVID-19 Symptoms, Cancer Clues & HK Pandemic Tech',
        prompt:
          'Compare symptoms and prevention: what distinguishes COVID-19 from cancer, AND how did Hong Kong use technology to fight COVID-19?',
        options: [
          'COVID-19 causes hard body lumps and is prevented by not eating processed meat; HK banned thermometers',
          'COVID-19 causes fever, sore throat & fatigue (monitored by border temperature screening, sewage tests, vaccination & mobile apps); cancer shows lumps & unexplained weight loss and is non-infectious',
          'Both COVID-19 and cancer spread via blood transfusions from mosquitoes',
          'Sewage testing only checks for iron rust in water pipes',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Remember Ch.8 — HKSAR used temperature screening at control points, sewage surveillance, vaccination programmes & mobile apps!',
        explanation:
          'COVID-19 is an infectious viral disease (fever, sore throat, cough, fatigue) tracked via border temperature checks, sewage tests, vaccination, and mobile apps. Cancer is non-infectious (abnormal cells forming lumps, unexplained weight loss/fatigue).',
        resourceBonus: 2,
      },
      {
        id: 't7-q4',
        type: 'classify',
        title: 'Cellular Biology Puzzle: Microscopic Cell & Pathogen Lab',
        prompt:
          'Inspect each microscopic specimen in our Cellular Lab and sort it into the correct biological group:',
        categories: [
          {
            id: 'normal_cell',
            label: 'Normal Body Cell',
            color: '#10b981',
            description: 'Healthy growth; keeps organs working smoothly',
          },
          {
            id: 'cancer_cell',
            label: 'Abnormal Cancer Cell',
            color: '#e11d48',
            description: 'Divides uncontrollably into a harmful tumour',
          },
          {
            id: 'pathogen',
            label: 'Infectious Pathogen',
            color: '#f59e0b',
            description: 'Bacteria, viruses, fungi, or parasites causing infection',
          },
          {
            id: 'immune_barrier',
            label: 'Immunity & Prevention',
            color: '#0ea5e9',
            description: 'Boosts resistance or blocks pathogen routes',
          },
        ],
        items: [
          { id: 'cell1', label: 'Healthy heart & lung cells dividing normally', emoji: '💚', correctCategory: 'normal_cell' },
          { id: 'cell2', label: 'Abnormal cells dividing uncontrollably into a harmful tumour', emoji: '🔴', correctCategory: 'cancer_cell' },
          { id: 'cell3', label: 'Flu / COVID-19 virus & Cholera bacteria', emoji: '🦠', correctCategory: 'pathogen' },
          { id: 'cell4', label: 'Vaccines, hand sanitiser & wearing masks', emoji: '💉', correctCategory: 'immune_barrier' },
        ],
        hint: 'Sparky says: Cancer is a NON-infectious disease — abnormal cells divide and grow uncontrollably!',
        explanation:
          'Normal cells keep organs working properly. Cancer occurs when abnormal cells divide uncontrollably into a harmful tumour, while pathogens cause infectious diseases.',
        resourceBonus: 3,
      },
      {
        id: 't7-q5',
        type: 'classify',
        title: 'Triangle of Infectious Diseases: Transmission Routes',
        prompt:
          'Classify each disease from our P4 Revision Chart by its main Transmission Route or Type:',
        categories: [
          {
            id: 'air_contact',
            label: 'Droplets / Contact',
            color: '#3b82f6',
            description: 'Coughing droplets or touching (Flu, HFMD)',
          },
          {
            id: 'vector_food_blood',
            label: 'Vectors / Food / Blood',
            color: '#f97316',
            description: 'Mosquitoes, contaminated food, or blood',
          },
          {
            id: 'non_infectious',
            label: 'Non-infectious (Urban)',
            color: '#8b5cf6',
            description: 'Not caused by pathogens (Cancer, Heart, Stroke)',
          },
        ],
        items: [
          { id: 'dis1', label: 'Influenza (droplets) & Hand, Foot and Mouth Disease (contact)', emoji: '😷', correctCategory: 'air_contact' },
          { id: 'dis2', label: 'Dengue / Chikungunya (mosquito vectors) & Cholera (food)', emoji: '🦟', correctCategory: 'vector_food_blood' },
          { id: 'dis3', label: 'Hepatitis B (blood-borne virus)', emoji: '🩸', correctCategory: 'vector_food_blood' },
          { id: 'dis4', label: 'Colorectal cancer, Heart disease & Stroke', emoji: '🫀', correctCategory: 'non_infectious' },
        ],
        hint: 'Sparky says: The Triangle of Infectious Diseases has 3 parts: Pathogens, Sources/Transmission routes, and High-risk people!',
        explanation:
          'Flu spreads via droplets; HFMD via contact; Dengue & Chikungunya via mosquitoes; Cholera via food; Hepatitis B via blood. Cancer, heart disease, and stroke are non-infectious.',
        resourceBonus: 3,
      },
      {
        id: 't7-q6',
        type: 'mcq',
        title: 'Heart Disease, Cancer & Prevention',
        prompt:
          'Which statement about preventing infectious and non-infectious diseases is CORRECT?',
        options: [
          'Cancer is spread by coughing droplets, so wearing a mask prevents cancer',
          'Heart disease occurs when fatty deposits build up in blood vessels, narrowing blood flow to heart muscles; healthy diet, exercise, and no smoking lower risk',
          'To prevent dengue fever, leave stagnant water in flowerpots for mosquitoes',
          'Washing hands is useless because bacteria cannot be washed away',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Remove stagnant water to stop mosquitoes, eat balanced meals, avoid smoking, and keep active!',
        explanation:
          'Fatty deposits narrow coronary blood vessels, reducing oxygen/blood to heart muscles. Balanced diet, regular exercise, and avoiding smoking/alcohol keep cells and organs healthy.',
        resourceBonus: 2,
      },
    ],
  },

  // =========================================================================
  // SEMESTER 2 — 小時鐘 P4 TOPICS 8-14
  // =========================================================================
  {
    id: 8,
    semester: 2,
    topicCode: 'Topic 8',
    title: 'Scientific Inquiry & Fair Testing',
    subtitle: 'Fixing unfair ice experiments, scientific spirit, and inquiry steps',
    mergedSource: '小時鐘 P4 Topic 8 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'inquiry_lab',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-8',
      name: 'Fair Test Detective',
      color: '#0ea5e9',
      icon: '🔬',
    },
    rewardResource: {
      id: 'lab_quartz',
      name: 'Inquiry Lab Lens',
      color: '#38bdf8',
      accentColor: '#e0f2fe',
      icon: '🔍',
    },
    sparkyIntro:
      'Sam saw ice cream melting fast! Redesign Mei & Ron’s flawed ice tests and test your scientific spirit!',
    quests: [
      {
        id: 't8-q1',
        type: 'mcq',
        title: 'Redesigning Mei & Ron’s Ice-Cube Fair Test',
        prompt:
          'Sam wondered: "Will ice melt faster in a hot place?" Mei used different-sized ice cubes, while Ron used a metal bowl in the sun and a plastic bowl in the shade. How should they design a FAIR test?',
        options: [
          'Use two ice cubes of the SAME size in IDENTICAL containers (one under the sun, one in the shade) and measure melting time with a timer',
          'Put a giant ice block in a metal pot in the sun and a tiny ice chip in plastic in the shade',
          'Guess the answer from memory without running any experiment',
          'Change both container material and ice cube size at the same time',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Keep ice size AND container material identical so ONLY temperature/sunlight differs!',
        explanation:
          'A fair test changes ONLY the one factor being tested (sun vs shade). Ice cube size and bowl material must be controlled identically, and a timer measures the result fairly.',
        resourceBonus: 2,
      },
      {
        id: 't8-q2',
        type: 'classify',
        title: 'Scientific Spirit True / False Lab',
        prompt:
          'Evaluate these claims from 小時鐘 Topic 8 True/False exercises as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Scientific Spirit',
            color: '#16a34a',
            description: 'Accurate view of how science progresses',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Misunderstands science or fair tests',
          },
        ],
        items: [
          {
            id: 't8-c1',
            label: 'The Round Earth replacing the Flat Earth shows theories can be overturned by evidence',
            emoji: '🌍',
            correctCategory: 'true',
          },
          {
            id: 't8-c2',
            label: 'Scientists should stay curious, use imagination, and respect evidence',
            emoji: '💡',
            correctCategory: 'true',
          },
          {
            id: 't8-c3',
            label: 'Scientists must never question past conclusions or authority',
            emoji: '🙊',
            correctCategory: 'false',
          },
          {
            id: 't8-c4',
            label: 'Fair tests are the ONLY way to find answers to every scientific question',
            emoji: '🚫',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: Scientists DO need imagination and healthy doubts — and astronomy or fossil studies also use observation/comparison besides fair tests!',
        explanation:
          'Science advances when thinkers observe, imagine, question old authority with evidence (like Round Earth replacing Flat Earth), and use fair tests alongside observation and classification.',
        resourceBonus: 2,
      },
      {
        id: 't8-q3',
        type: 'sequence',
        title: 'Sam’s Ice-Melting Investigation Sequence',
        prompt:
          'Order Sam’s real-world inquiry steps from noticing ice cream melting to drawing a conclusion:',
        items: [
          { id: 'step3', label: 'Fair Test: Two equal ice cubes in identical bowls (sun vs shade) + timer', emoji: '⏱️' },
          { id: 'step1', label: 'Observe: Ice cream melts much faster in hot summer weather', emoji: '🍦' },
          { id: 'step4', label: 'Analyze & Reflect: Compare melting times and verify hypothesis', emoji: '📊' },
          { id: 'step2', label: 'Question & Hypothesis: "Will ice melt faster in a hot place?"', emoji: '❓' },
        ],
        correctOrder: ['step1', 'step2', 'step3', 'step4'],
        hint: 'Sparky says: Observe → Question & Hypothesis → Fair Test → Analyze & Reflect!',
        explanation:
          'Every investigation moves smoothly from Observation → Question & Hypothesis → Controlled Fair Test → Analysis & Reflection.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't8-q1',
        type: 'mcq',
        title: 'Redesigning Mei & Ron’s Ice-Cube Fair Test',
        prompt:
          'Sam wondered: "Will ice melt faster in a hot place?" Mei used different-sized ice cubes, while Ron used a metal bowl in the sun and a plastic bowl in the shade. How should they design a FAIR test?',
        options: [
          'Use two ice cubes of the SAME size in IDENTICAL containers (one under the sun, one in the shade) and measure melting time with a timer',
          'Put a giant ice block in a metal pot in the sun and a tiny ice chip in plastic in the shade',
          'Guess the answer from memory without running any experiment',
          'Change both container material and ice cube size at the same time',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Keep ice size AND container material identical so ONLY temperature/sunlight differs!',
        explanation:
          'A fair test changes ONLY the one factor being tested (sun vs shade). Ice cube size and bowl material must be controlled identically, and a timer measures the result fairly.',
        resourceBonus: 2,
      },
      {
        id: 't8-q2',
        type: 'classify',
        title: 'Scientific Spirit True / False Lab',
        prompt:
          'Evaluate these claims from 小時鐘 Topic 8 True/False exercises as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Scientific Spirit',
            color: '#16a34a',
            description: 'Accurate view of how science progresses',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Misunderstands science or fair tests',
          },
        ],
        items: [
          {
            id: 't8-c1',
            label: 'The Round Earth replacing the Flat Earth shows theories can be overturned by evidence',
            emoji: '🌍',
            correctCategory: 'true',
          },
          {
            id: 't8-c2',
            label: 'Scientists should stay curious, use imagination, and respect evidence',
            emoji: '💡',
            correctCategory: 'true',
          },
          {
            id: 't8-c3',
            label: 'Scientists must never question past conclusions or authority',
            emoji: '🙊',
            correctCategory: 'false',
          },
          {
            id: 't8-c4',
            label: 'Fair tests are the ONLY way to find answers to every scientific question',
            emoji: '🚫',
            correctCategory: 'false',
          },
        ],
        hint: 'Sparky says: Scientists DO need imagination and healthy doubts — and astronomy or fossil studies also use observation/comparison besides fair tests!',
        explanation:
          'Science advances when thinkers observe, imagine, question old authority with evidence (like Round Earth replacing Flat Earth), and use fair tests alongside observation and classification.',
        resourceBonus: 2,
      },
      {
        id: 't8-q3',
        type: 'sequence',
        title: 'Sam’s Ice-Melting Investigation Sequence',
        prompt:
          'Order Sam’s real-world inquiry steps from noticing ice cream melting to drawing a conclusion:',
        items: [
          { id: 'step3', label: 'Fair Test: Two equal ice cubes in identical bowls (sun vs shade) + timer', emoji: '⏱️' },
          { id: 'step1', label: 'Observe: Ice cream melts much faster in hot summer weather', emoji: '🍦' },
          { id: 'step4', label: 'Analyze & Reflect: Compare melting times and verify hypothesis', emoji: '📊' },
          { id: 'step2', label: 'Question & Hypothesis: "Will ice melt faster in a hot place?"', emoji: '❓' },
        ],
        correctOrder: ['step1', 'step2', 'step3', 'step4'],
        hint: 'Sparky says: Observe → Question & Hypothesis → Fair Test → Analyze & Reflect!',
        explanation:
          'Every investigation moves smoothly from Observation → Question & Hypothesis → Controlled Fair Test → Analysis & Reflection.',
        resourceBonus: 2,
      },
      {
        id: 't8-q4',
        type: 'sequence',
        title: 'The 5 Steps of Scientific Inquiry',
        prompt:
          'Put the 5 steps of establishing new scientific knowledge in the exact order:',
        items: [
          { id: 'test', label: 'Test the hypothesis (Run fair test)', emoji: '🧪' },
          { id: 'observe', label: 'Observe things', emoji: '👀' },
          { id: 'analyze', label: 'Analyze and reflect on the results', emoji: '📊' },
          { id: 'ask', label: 'Ask a question', emoji: '❓' },
          { id: 'hypo', label: 'Propose a hypothesis', emoji: '💡' },
        ],
        correctOrder: ['observe', 'ask', 'hypo', 'test', 'analyze'],
        hint: 'Sparky says: First observe → ask → propose a hypothesis → test → analyze!',
        explanation:
          'Scientific Inquiry follows: Observe things → Ask a question → Propose a hypothesis → Test the hypothesis → Analyze and reflect on the results.',
        resourceBonus: 2,
      },
      {
        id: 't8-q5',
        type: 'mcq',
        title: 'Why Were Mei & Ron’s Tests Unfair?',
        prompt:
          'Mei used two DIFFERENT-SIZED ice cubes (smaller in sun, larger in shade). Ron put equal ice cubes in a METAL bowl in the sun and a PLASTIC bowl in the shade. Why were BOTH unfair?',
        options: [
          'They both forgot to use a timer',
          'Each changed MORE THAN ONE variable (Mei also changed ice size; Ron also changed bowl material which conducts heat faster)',
          'Ice cubes can never melt in plastic bowls',
          'Because a hypothesis is always 100% correct without testing',
        ],
        correctIndex: 1,
        hint: 'Sparky says: In a fair test, ONLY ONE factor may change — all other conditions must stay identical!',
        explanation:
          'Mei changed ice size and Ron changed bowl material alongside sunlight, making both tests unfair.',
        resourceBonus: 2,
      },
      {
        id: 't8-q6',
        type: 'mcq',
        title: 'Scientific Attitudes & Spirit',
        prompt:
          'Which statement reflects true scientific spirit?',
        options: [
          'Never question past scientific conclusions or authority',
          'Imagination has no place in science',
          'Respect evidence and facts, keep curiosity/doubts, and know accepted theories (like Flat Earth) can be overturned by new evidence',
          'Change three variables at once to finish tests faster',
        ],
        correctIndex: 2,
        hint: 'Sparky says: Remember how the Round Earth Theory replaced the Flat Earth Theory!',
        explanation:
          'Scientists respect facts and evidence, maintain healthy doubts, conduct fair tests, and revise theories when new evidence appears.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 9,
    semester: 2,
    topicCode: 'Topic 9',
    title: 'Energy & Closed Circuits',
    subtitle: 'Crude oil fuels, HK power companies, circuit faults & clean energy',
    mergedSource: '小時鐘 P4 Topic 9 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'circuit_grid',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-9',
      name: 'Circuit Spark Master',
      color: '#eab308',
      icon: '⚡',
    },
    rewardResource: {
      id: 'redstone_spark',
      name: 'Redstone Spark Block',
      color: '#ef4444',
      accentColor: '#fde047',
      icon: '🔋',
    },
    sparkyIntro:
      'Check crude oil fuels, Hong Kong’s two power companies, and diagnose faulty circuit diagrams!',
    quests: [
      {
        id: 't9-q1',
        type: 'mcq',
        title: 'Crude Oil Fuels & Hong Kong’s Two Power Companies',
        prompt:
          'Which fuels are refined from crude oil (petroleum), AND which two companies generate and supply electricity across Hong Kong?',
        options: [
          'Petrol, diesel & liquefied petroleum gas (LPG); Hongkong Electric Company Limited and CLP Power Hong Kong Limited',
          'Solar panels & river dams; Hong Kong Observatory and Water Supplies Department',
          'Coal & dry wood; only CLP Power serves all of Hong Kong Island and Kowloon',
          'Natural gas & wind turbines; Hong Kong Post and MTR',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Petrol, diesel, and LPG are petroleum products, and HK has TWO electricity companies (HK Electric & CLP Power)!',
        explanation:
          'Crude oil (petroleum) refines into petrol, diesel, and LPG. Hong Kong’s electricity is supplied by Hongkong Electric Company Limited (HK Island & Lamma) and CLP Power Hong Kong Limited (Kowloon, NT & Lantau).',
        resourceBonus: 2,
      },
      {
        id: 't9-q2',
        type: 'classify',
        title: '10 Circuit Diagrams Fault Finder',
        prompt:
          'Inspect these circuit setups from 小時鐘 Topic 9 diagrams (a–j) and sort whether the bulb LIGHTS UP or FAILS to light up:',
        categories: [
          {
            id: 'lights',
            label: 'Bulb Lights Up',
            color: '#eab308',
            description: 'Complete closed circuit with proper battery polarity',
          },
          {
            id: 'fails',
            label: 'Fails to Light Up',
            color: '#64748b',
            description: 'Open circuit, missing pole connection, or opposing batteries',
          },
        ],
        items: [
          { id: 't9-c1', label: 'Closed switch connecting + pole → bulb → − pole in one loop', emoji: '💡', correctCategory: 'lights' },
          { id: 't9-c2', label: '2 batteries aligned (+ to −) with closed switch & 1 bulb', emoji: '🔆', correctCategory: 'lights' },
          { id: 't9-c3', label: 'Both wires attached to the + pole only, OR batteries placed + facing +', emoji: '🪫', correctCategory: 'fails' },
          { id: 't9-c4', label: 'Switch left OPEN, OR wire stops short of the bulb metal base', emoji: '🔌', correctCategory: 'fails' },
        ],
        hint: 'Sparky says: Electricity needs an unbroken path from + pole through the bulb to the − pole, with batteries lined up + to −!',
        explanation:
          'A bulb only lights in a closed loop from + to − with aligned batteries (+ to −) and a closed switch. Open switches, same-pole wiring, or opposing (+ to +) batteries stop the bulb from lighting.',
        resourceBonus: 2,
      },
      {
        id: 't9-q3',
        type: 'mcq',
        title: 'HK Renewable Energy Policies & Limitations',
        prompt:
          'How does the Hong Kong Government promote renewable energy, AND what is a real limitation of solar or wind power?',
        options: [
          'Feed-in Tariff scheme, Renewable Energy Certificates, tax incentives & waste-to-energy; solar depends on weather/daylight while wind turbines need steady wind and create noise',
          'Free petrol vouchers for cars; solar and wind power work identically underground in the dark',
          'Banning all batteries in schools; hydropower needs dry deserts',
          'Building coal-only power stations; renewable energy produces maximum carbon dioxide',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Remember Topic 9’s HK policies — Feed-in Tariff lets solar owners sell clean electricity back to the grid!',
        explanation:
          'Hong Kong promotes Feed-in Tariffs, Renewable Energy Certificates, tax incentives, and waste-to-energy facilities. Solar power depends on daylight/weather, and wind turbines require steady wind and cause noise.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't9-q1',
        type: 'mcq',
        title: 'Crude Oil Fuels & Hong Kong’s Two Power Companies',
        prompt:
          'Which fuels are refined from crude oil (petroleum), AND which two companies generate and supply electricity across Hong Kong?',
        options: [
          'Petrol, diesel & liquefied petroleum gas (LPG); Hongkong Electric Company Limited and CLP Power Hong Kong Limited',
          'Solar panels & river dams; Hong Kong Observatory and Water Supplies Department',
          'Coal & dry wood; only CLP Power serves all of Hong Kong Island and Kowloon',
          'Natural gas & wind turbines; Hong Kong Post and MTR',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Petrol, diesel, and LPG are petroleum products, and HK has TWO electricity companies (HK Electric & CLP Power)!',
        explanation:
          'Crude oil (petroleum) refines into petrol, diesel, and LPG. Hong Kong’s electricity is supplied by Hongkong Electric Company Limited (HK Island & Lamma) and CLP Power Hong Kong Limited (Kowloon, NT & Lantau).',
        resourceBonus: 2,
      },
      {
        id: 't9-q2',
        type: 'classify',
        title: '10 Circuit Diagrams Fault Finder',
        prompt:
          'Inspect these circuit setups from 小時鐘 Topic 9 diagrams (a–j) and sort whether the bulb LIGHTS UP or FAILS to light up:',
        categories: [
          {
            id: 'lights',
            label: 'Bulb Lights Up',
            color: '#eab308',
            description: 'Complete closed circuit with proper battery polarity',
          },
          {
            id: 'fails',
            label: 'Fails to Light Up',
            color: '#64748b',
            description: 'Open circuit, missing pole connection, or opposing batteries',
          },
        ],
        items: [
          { id: 't9-c1', label: 'Closed switch connecting + pole → bulb → − pole in one loop', emoji: '💡', correctCategory: 'lights' },
          { id: 't9-c2', label: '2 batteries aligned (+ to −) with closed switch & 1 bulb', emoji: '🔆', correctCategory: 'lights' },
          { id: 't9-c3', label: 'Both wires attached to the + pole only, OR batteries placed + facing +', emoji: '🪫', correctCategory: 'fails' },
          { id: 't9-c4', label: 'Switch left OPEN, OR wire stops short of the bulb metal base', emoji: '🔌', correctCategory: 'fails' },
        ],
        hint: 'Sparky says: Electricity needs an unbroken path from + pole through the bulb to the − pole, with batteries lined up + to −!',
        explanation:
          'A bulb only lights in a closed loop from + to − with aligned batteries (+ to −) and a closed switch. Open switches, same-pole wiring, or opposing (+ to +) batteries stop the bulb from lighting.',
        resourceBonus: 2,
      },
      {
        id: 't9-q3',
        type: 'mcq',
        title: 'HK Renewable Energy Policies & Limitations',
        prompt:
          'How does the Hong Kong Government promote renewable energy, AND what is a real limitation of solar or wind power?',
        options: [
          'Feed-in Tariff scheme, Renewable Energy Certificates, tax incentives & waste-to-energy; solar depends on weather/daylight while wind turbines need steady wind and create noise',
          'Free petrol vouchers for cars; solar and wind power work identically underground in the dark',
          'Banning all batteries in schools; hydropower needs dry deserts',
          'Building coal-only power stations; renewable energy produces maximum carbon dioxide',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Remember Topic 9’s HK policies — Feed-in Tariff lets solar owners sell clean electricity back to the grid!',
        explanation:
          'Hong Kong promotes Feed-in Tariffs, Renewable Energy Certificates, tax incentives, and waste-to-energy facilities. Solar power depends on daylight/weather, and wind turbines require steady wind and cause noise.',
        resourceBonus: 2,
      },
      {
        id: 't9-q4',
        type: 'classify',
        title: 'Primary Energy: Renewable vs Non-renewable',
        prompt:
          'Classify each energy source and its limitation or property:',
        categories: [
          {
            id: 'non_renew',
            label: 'Non-renewable Fossil Fuels',
            color: '#64748b',
            description: 'Limited underground; causes air pollution & warming',
          },
          {
            id: 'renew',
            label: 'Renewable Energy',
            color: '#10b981',
            description: 'Naturally replenished; low carbon emission',
          },
        ],
        items: [
          { id: 'en1', label: 'Coal, Oil (petroleum) & Natural Gas', emoji: '🛢️', correctCategory: 'non_renew' },
          { id: 'en2', label: 'Solar power (depends on weather/daylight)', emoji: '☀️', correctCategory: 'renew' },
          { id: 'en3', label: 'Wind power (needs stable wind; noisy)', emoji: '🌬️', correctCategory: 'renew' },
          { id: 'en4', label: 'Hydropower (needs large rivers/dams)', emoji: '💧', correctCategory: 'renew' },
        ],
        hint: 'Sparky says: Fossil fuels formed over millions of years and cannot be quickly replaced!',
        explanation:
          'Coal, oil, and natural gas are non-renewable fossil fuels that pollute air and worsen global warming. Solar, wind, and hydropower are renewable.',
        resourceBonus: 2,
      },
      {
        id: 't9-q5',
        type: 'mcq',
        title: 'Closed Circuits & Switch Control',
        prompt:
          'Dry batteries have a positive (+) pole and a negative (−) pole. When does a light bulb light up?',
        options: [
          'When the switch is OPEN, disconnecting the circuit',
          'When wires connect + and − poles through the bulb in an unbroken CLOSED circuit with the switch closed',
          'When both wires touch only the + pole of one battery',
          'When two batteries face + to + against each other',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Opening a switch breaks the path; closing a switch completes the closed circuit!',
        explanation:
          'Electric current only flows in a closed circuit connecting + to − through the bulb. Opening a switch disconnects the circuit.',
        resourceBonus: 2,
      },
      {
        id: 't9-q6',
        type: 'mcq',
        title: 'Brightest vs Dimmest Bulb Setup',
        prompt:
          'Comparing closed series circuits using identical batteries and bulbs: which circuit gives the BRIGHTEST bulb, and which gives the DIMMEST bulbs?',
        options: [
          '2 batteries in series (+ to −) with 1 bulb is BRIGHTEST; 1 battery sharing power across 3 bulbs in series is DIMMEST',
          '1 battery with 3 bulbs is brightest; 2 batteries with 1 bulb is dimmest',
          'An open switch circuit is brightest',
          'All closed circuits have the exact same brightness',
        ],
        correctIndex: 0,
        hint: 'Sparky says: More batteries pushing 1 bulb = brighter; 1 battery split among 3 bulbs = dimmer!',
        explanation:
          'Two batteries connected properly (+ to −) with 1 bulb give the brightest glow, whereas 1 battery powering 3 bulbs in series makes each bulb dimmest.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 10,
    semester: 2,
    topicCode: 'Topic 10',
    title: 'Metals, Non-metals & Engineering Design',
    subtitle: 'Copper/wood/plastic butter race, daily objects & Tim’s book stand',
    mergedSource: '小時鐘 P4 Topic 10 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'forge_metals',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-10',
      name: 'Master Engineer',
      color: '#f97316',
      icon: '🔧',
    },
    rewardResource: {
      id: 'copper_ingot',
      name: 'Copper Ingot',
      color: '#ea580c',
      accentColor: '#fdba74',
      icon: '🧱',
    },
    sparkyIntro:
      'Run the Hot-Water Butter Race on Copper, Wood & Plastic rods, and upgrade Tim’s cardboard book stand!',
    quests: [
      {
        id: 't10-q1',
        type: 'sequence',
        title: 'Hot-Water Rod Butter-Melting Race',
        prompt:
          'Three rods (Copper, Wood, Plastic) with butter blobs on top stand in a beaker of hot water. Order them from 1st to melt butter (BEST heat conductor) to 3rd (SLOWEST conductor):',
        items: [
          { id: 'plastic', label: 'Plastic rod (Non-metal — slowest heat transfer)', emoji: '🥤' },
          { id: 'copper', label: 'Copper rod (Metal — melts butter fastest)', emoji: '🥉' },
          { id: 'wood', label: 'Wooden rod (Non-metal — conducts slowly)', emoji: '🪵' },
        ],
        correctOrder: ['copper', 'wood', 'plastic'],
        hint: 'Sparky says: Remember the experiment table in 小時鐘 Topic 10 — butter melts 1st on Copper, 2nd on Wood, and 3rd on Plastic!',
        explanation:
          'Metals like copper are good conductors of heat so the butter melts 1st. Both wood and plastic are poor heat conductors (non-metals), with wood transferring heat slightly ahead of plastic.',
        resourceBonus: 2,
      },
      {
        id: 't10-q2',
        type: 'classify',
        title: 'Kitchen & Daily Material Sorter',
        prompt:
          'Sort these everyday objects from 小時鐘 Topic 10 into METALS or NON-METALS:',
        categories: [
          {
            id: 'metal',
            label: 'Metals',
            color: '#f97316',
            description: 'Hard, opaque, shiny & good heat/electricity conductors',
          },
          {
            id: 'non_metal',
            label: 'Non-metals',
            color: '#3b82f6',
            description: 'Wood, plastic, glass, rubber; usually poor conductors',
          },
        ],
        items: [
          { id: 't10-c1', label: 'Cooking pot, Frying pan & Screw', emoji: '🍳', correctCategory: 'metal' },
          { id: 't10-c2', label: 'Iron base of electric iron & Plug pins', emoji: '🔌', correctCategory: 'metal' },
          { id: 't10-c3', label: 'Wooden crate & Plastic storage box', emoji: '📦', correctCategory: 'non_metal' },
          { id: 't10-c4', label: 'Wine glass & Glass mirror', emoji: '🪞', correctCategory: 'non_metal' },
        ],
        hint: 'Sparky says: Watch out — glass mirrors look shiny, just like metals, yet glass is a NON-METAL!',
        explanation:
          'Cooking pots, frying pans, screws, plug pins, and iron bases are metals. Wooden crates, plastic boxes, wine glasses, and glass mirrors are made of non-metals.',
        resourceBonus: 2,
      },
      {
        id: 't10-q3',
        type: 'mcq',
        title: 'Improving Tim’s Cardboard Book Stand',
        prompt:
          'During Step 5 (Testing & Analysis), Tim found his cardboard book stand wobbled under heavy textbooks. What did he do in Step 6 (Improvement) and why is engineering design a cycle?',
        options: [
          'He added thicker cardboard to the base for stability and re-tested if it held more books; engineering design repeats testing & improving continuously',
          'He threw away the prototype without testing it because Step 1 was finished',
          'He wrapped the cardboard in butter so books would slide faster',
          'He stopped after drawing the sketch because Step 7 has no reflection',
        ],
        correctIndex: 0,
        hint: 'Sparky says: In Topic 10, Tim reinforced the base with thicker cardboard and re-tested — design is a continuous cycle!',
        explanation:
          'Tim improved his book stand in Step 6 by reinforcing the base with thicker cardboard and re-testing load strength. Engineering design is a continuous cycle of testing, analyzing, and improving.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't10-q1',
        type: 'sequence',
        title: 'Hot-Water Rod Butter-Melting Race',
        prompt:
          'Three rods (Copper, Wood, Plastic) with butter blobs on top stand in a beaker of hot water. Order them from 1st to melt butter (BEST heat conductor) to 3rd (SLOWEST conductor):',
        items: [
          { id: 'plastic', label: 'Plastic rod (Non-metal — slowest heat transfer)', emoji: '🥤' },
          { id: 'copper', label: 'Copper rod (Metal — melts butter fastest)', emoji: '🥉' },
          { id: 'wood', label: 'Wooden rod (Non-metal — conducts slowly)', emoji: '🪵' },
        ],
        correctOrder: ['copper', 'wood', 'plastic'],
        hint: 'Sparky says: Remember the experiment table in 小時鐘 Topic 10 — butter melts 1st on Copper, 2nd on Wood, and 3rd on Plastic!',
        explanation:
          'Metals like copper are good conductors of heat so the butter melts 1st. Both wood and plastic are poor heat conductors (non-metals), with wood transferring heat slightly ahead of plastic.',
        resourceBonus: 2,
      },
      {
        id: 't10-q2',
        type: 'classify',
        title: 'Kitchen & Daily Material Sorter',
        prompt:
          'Sort these everyday objects from 小時鐘 Topic 10 into METALS or NON-METALS:',
        categories: [
          {
            id: 'metal',
            label: 'Metals',
            color: '#f97316',
            description: 'Hard, opaque, shiny & good heat/electricity conductors',
          },
          {
            id: 'non_metal',
            label: 'Non-metals',
            color: '#3b82f6',
            description: 'Wood, plastic, glass, rubber; usually poor conductors',
          },
        ],
        items: [
          { id: 't10-c1', label: 'Cooking pot, Frying pan & Screw', emoji: '🍳', correctCategory: 'metal' },
          { id: 't10-c2', label: 'Iron base of electric iron & Plug pins', emoji: '🔌', correctCategory: 'metal' },
          { id: 't10-c3', label: 'Wooden crate & Plastic storage box', emoji: '📦', correctCategory: 'non_metal' },
          { id: 't10-c4', label: 'Wine glass & Glass mirror', emoji: '🪞', correctCategory: 'non_metal' },
        ],
        hint: 'Sparky says: Watch out — glass mirrors look shiny, just like metals, yet glass is a NON-METAL!',
        explanation:
          'Cooking pots, frying pans, screws, plug pins, and iron bases are metals. Wooden crates, plastic boxes, wine glasses, and glass mirrors are made of non-metals.',
        resourceBonus: 2,
      },
      {
        id: 't10-q3',
        type: 'mcq',
        title: 'Improving Tim’s Cardboard Book Stand',
        prompt:
          'During Step 5 (Testing & Analysis), Tim found his cardboard book stand wobbled under heavy textbooks. What did he do in Step 6 (Improvement) and why is engineering design a cycle?',
        options: [
          'He added thicker cardboard to the base for stability and re-tested if it held more books; engineering design repeats testing & improving continuously',
          'He threw away the prototype without testing it because Step 1 was finished',
          'He wrapped the cardboard in butter so books would slide faster',
          'He stopped after drawing the sketch because Step 7 has no reflection',
        ],
        correctIndex: 0,
        hint: 'Sparky says: In Topic 10, Tim reinforced the base with thicker cardboard and re-tested — design is a continuous cycle!',
        explanation:
          'Tim improved his book stand in Step 6 by reinforcing the base with thicker cardboard and re-testing load strength. Engineering design is a continuous cycle of testing, analyzing, and improving.',
        resourceBonus: 2,
      },
      {
        id: 't10-q4',
        type: 'classify',
        title: 'Electric Iron Materials Lab',
        prompt:
          'Sort the parts of an electric iron into METAL (conducts heat/electricity) or NON-METAL (insulates for safety):',
        categories: [
          {
            id: 'metal',
            label: 'Metal (Conductor)',
            color: '#f97316',
            description: 'Shiny, hard, conducts heat & electricity quickly',
          },
          {
            id: 'non_metal',
            label: 'Non-metal (Insulator)',
            color: '#3b82f6',
            description: 'Poor conductor; prevents burns & electric shock',
          },
        ],
        items: [
          { id: 'm1', label: 'Iron Base (transfers heat quickly to smooth clothes)', emoji: '♨️', correctCategory: 'metal' },
          { id: 'm2', label: 'Pin of the Plug (transfers electricity from socket)', emoji: '🔌', correctCategory: 'metal' },
          { id: 'm3', label: 'Plastic Handle (insulates heat so hands stay safe)', emoji: '✋', correctCategory: 'non_metal' },
          { id: 'm4', label: 'Outer Cable & Plug Case (prevents electric shock)', emoji: '🛡️', correctCategory: 'non_metal' },
        ],
        hint: 'Sparky says: The hot base and plug pins must conduct heat/electricity, while handles and cord covers insulate to protect hands!',
        explanation:
          'Metals (iron base, plug pins) conduct heat and electricity quickly; non-metals (plastic handle, rubber cord cover) insulate us for safety.',
        resourceBonus: 2,
      },
      {
        id: 't10-q5',
        type: 'mcq',
        title: 'True or False: Metals vs Non-metals',
        prompt:
          'Which of the following statements about materials is INCORRECT?',
        options: [
          'Metal baking moulds conduct heat quickly in an oven',
          'Cloth gloves and wooden spoons are poor conductors of heat',
          'ALL shiny and hard objects are metals, and ALL non-metals are complete insulators',
          'The engineering design process is a continuous cycle, not a one-off step',
        ],
        correctIndex: 2,
        hint: 'Sparky says: Think about shiny diamonds/glass (not metals!) or graphite/salt water (non-metals that conduct)!',
        explanation:
          'Not all shiny, hard objects are metals (e.g. glass, diamond), and not all non-metals fail to conduct electricity (e.g. graphite conducts!).',
        resourceBonus: 2,
      },
      {
        id: 't10-q6',
        type: 'sequence',
        title: 'Tim’s Engineering Design Cycle',
        prompt:
          'Order the 7-step Engineering Design Process Tim used to build a stable book stand:',
        items: [
          { id: 'make', label: 'Drawing a design → Making the product', emoji: '🛠️' },
          { id: 'define', label: 'Define the problem → Collect information', emoji: '📋' },
          { id: 'present', label: 'Presentation and reflection', emoji: '🎤' },
          { id: 'test', label: 'Testing, analysis → Improvement (thicker cardboard)', emoji: '📐' },
        ],
        correctOrder: ['define', 'make', 'test', 'present'],
        hint: 'Sparky says: Define & Collect info first → Draw & Make → Test & Improve → Present & Reflect!',
        explanation:
          'The 7 Engineering Design steps are: Define problem → Collect info → Draw design → Make product → Test & analyze → Improve → Present & reflect.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 11,
    semester: 2,
    topicCode: 'Topic 11',
    title: 'Changes of Matter',
    subtitle: '5 clues of chemical change, popcorn, rotting leaves & sugar dissolving',
    mergedSource: '小時鐘 P4 Topic 11 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'matter_camp',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-11',
      name: 'Matter Alchemist',
      color: '#dc2626',
      icon: '🔥',
    },
    rewardResource: {
      id: 'matter_cube',
      name: 'Alchemy Matter Cube',
      color: '#f43f5e',
      accentColor: '#fbbf24',
      icon: '🧪',
    },
    sparkyIntro:
      'Watch corn pop, apples turn brown, and candle wax melt! Master the 5 clues of chemical changes!',
    quests: [
      {
        id: 't11-q1',
        type: 'classify',
        title: 'New Everyday Matter Changes Lab',
        prompt:
          'Sort these everyday situations from 小時鐘 Topic 11 into PHYSICAL CHANGE or CHEMICAL CHANGE:',
        categories: [
          {
            id: 'physical',
            label: 'Physical Change',
            color: '#0ea5e9',
            description: 'Only shape, size, or state changes; NO new matter',
          },
          {
            id: 'chemical',
            label: 'Chemical Change',
            color: '#ef4444',
            description: 'New matter formed; colour/smell/mold/irreversible',
          },
        ],
        items: [
          { id: 't11-c1', label: 'Sharpening a pencil, folding paper & breaking a glass', emoji: '✏️', correctCategory: 'physical' },
          { id: 't11-c2', label: 'Melting butter & stretching a rubber band', emoji: '🧈', correctCategory: 'physical' },
          { id: 't11-c3', label: 'Apple slice turning brown & milk turning sour', emoji: '🍎', correctCategory: 'chemical' },
          { id: 't11-c4', label: 'Heating corn kernels into popcorn & bread growing moldy', emoji: '🍿', correctCategory: 'chemical' },
        ],
        hint: 'Sparky says: Sharpening wood or melting butter changes only shape or state — whereas sour milk, brown apples, mold, and popcorn form NEW substances!',
        explanation:
          'Pencil sharpening, folding paper, breaking glass, melting butter, and stretching rubber bands do not create new substances (physical). Apples browning, milk souring, moldy bread, and popcorn form new matter (chemical).',
        resourceBonus: 2,
      },
      {
        id: 't11-q2',
        type: 'mcq',
        title: 'The 5 Clues of a Chemical Change',
        prompt:
          'Which set correctly lists clues taught in 小時鐘 Topic 11 that show a CHEMICAL CHANGE has taken place?',
        options: [
          'New matter is formed, change in colour/smell, irreversible (e.g. cooked egg), rotting/molding, or smoke, flames & odor',
          'Only changing size with scissors, folding neatly, or freezing water into ice cubes',
          'Melting ice cream on a hot day with no smell or colour change',
          'Dissolving sugar in warm tea where sugar tastes sweet as before',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Check if new matter formed — look for colour/smell changes, molding/rotting, smoke/flames, or irreversible cooking!',
        explanation:
          'Five reliable signs of chemical change are: (1) new matter formed, (2) colour or smell changes, (3) irreversible (like cooking an egg), (4) molding/rotting, and (5) smoke, flames, or strong odor.',
        resourceBonus: 2,
      },
      {
        id: 't11-q3',
        type: 'mcq',
        title: 'Popcorn, Rotting Leaves & Candle Wax',
        prompt:
          'A student heats corn kernels into popcorn, watches fallen leaves rot into soil, and melts candle wax in a spoon. Which process(es) are CHEMICAL changes?',
        options: [
          'Only melting candle wax in a spoon is a chemical change',
          'Heating corn into popcorn and rotting leaves are chemical changes; melting candle wax alone only changes state (physical change)',
          'All three are purely physical changes because they involve heat or plants',
          'Rotting leaves turn straight back into fresh green leaves',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Melted wax cools right back into solid wax (physical), whereas popcorn and rotting leaves create brand-new matter!',
        explanation:
          'Popping corn and rotting leaves are irreversible chemical changes producing new matter. Melting solid wax into liquid wax is a reversible physical change of state (unless the wick burns!).',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't11-q1',
        type: 'classify',
        title: 'New Everyday Matter Changes Lab',
        prompt:
          'Sort these everyday situations from 小時鐘 Topic 11 into PHYSICAL CHANGE or CHEMICAL CHANGE:',
        categories: [
          {
            id: 'physical',
            label: 'Physical Change',
            color: '#0ea5e9',
            description: 'Only shape, size, or state changes; NO new matter',
          },
          {
            id: 'chemical',
            label: 'Chemical Change',
            color: '#ef4444',
            description: 'New matter formed; colour/smell/mold/irreversible',
          },
        ],
        items: [
          { id: 't11-c1', label: 'Sharpening a pencil, folding paper & breaking a glass', emoji: '✏️', correctCategory: 'physical' },
          { id: 't11-c2', label: 'Melting butter & stretching a rubber band', emoji: '🧈', correctCategory: 'physical' },
          { id: 't11-c3', label: 'Apple slice turning brown & milk turning sour', emoji: '🍎', correctCategory: 'chemical' },
          { id: 't11-c4', label: 'Heating corn kernels into popcorn & bread growing moldy', emoji: '🍿', correctCategory: 'chemical' },
        ],
        hint: 'Sparky says: Sharpening wood or melting butter changes only shape or state — whereas sour milk, brown apples, mold, and popcorn form NEW substances!',
        explanation:
          'Pencil sharpening, folding paper, breaking glass, melting butter, and stretching rubber bands do not create new substances (physical). Apples browning, milk souring, moldy bread, and popcorn form new matter (chemical).',
        resourceBonus: 2,
      },
      {
        id: 't11-q2',
        type: 'mcq',
        title: 'The 5 Clues of a Chemical Change',
        prompt:
          'Which set correctly lists clues taught in 小時鐘 Topic 11 that show a CHEMICAL CHANGE has taken place?',
        options: [
          'New matter is formed, change in colour/smell, irreversible (e.g. cooked egg), rotting/molding, or smoke, flames & odor',
          'Only changing size with scissors, folding neatly, or freezing water into ice cubes',
          'Melting ice cream on a hot day with no smell or colour change',
          'Dissolving sugar in warm tea where sugar tastes sweet as before',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Check if new matter formed — look for colour/smell changes, molding/rotting, smoke/flames, or irreversible cooking!',
        explanation:
          'Five reliable signs of chemical change are: (1) new matter formed, (2) colour or smell changes, (3) irreversible (like cooking an egg), (4) molding/rotting, and (5) smoke, flames, or strong odor.',
        resourceBonus: 2,
      },
      {
        id: 't11-q3',
        type: 'mcq',
        title: 'Popcorn, Rotting Leaves & Candle Wax',
        prompt:
          'A student heats corn kernels into popcorn, watches fallen leaves rot into soil, and melts candle wax in a spoon. Which process(es) are CHEMICAL changes?',
        options: [
          'Only melting candle wax in a spoon is a chemical change',
          'Heating corn into popcorn and rotting leaves are chemical changes; melting candle wax alone only changes state (physical change)',
          'All three are purely physical changes because they involve heat or plants',
          'Rotting leaves turn straight back into fresh green leaves',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Melted wax cools right back into solid wax (physical), whereas popcorn and rotting leaves create brand-new matter!',
        explanation:
          'Popping corn and rotting leaves are irreversible chemical changes producing new matter. Melting solid wax into liquid wax is a reversible physical change of state (unless the wick burns!).',
        resourceBonus: 2,
      },
      {
        id: 't11-q4',
        type: 'classify',
        title: 'Physical vs Chemical Change Sorter',
        prompt:
          'Sort each everyday transformation into PHYSICAL CHANGE or CHEMICAL CHANGE:',
        categories: [
          {
            id: 'physical',
            label: 'Physical Change',
            color: '#0ea5e9',
            description: 'Only shape/state changes; no new matter',
          },
          {
            id: 'chemical',
            label: 'Chemical Change',
            color: '#ef4444',
            description: 'New matter formed; colour/smell/smoke/irreversible',
          },
        ],
        items: [
          { id: 'ch1', label: 'Ice cream melting & Blowing up balloons', emoji: '🍦', correctCategory: 'physical' },
          { id: 'ch2', label: 'Dissolving sugar in water & Heating water to steam', emoji: '💧', correctCategory: 'physical' },
          { id: 'ch3', label: 'Lighting a match & Frying an egg', emoji: '🔥', correctCategory: 'chemical' },
          { id: 'ch4', label: 'Meat turning bad & Ripening of a banana', emoji: '🍌', correctCategory: 'chemical' },
        ],
        hint: 'Sparky says: Dissolving sugar only breaks sugar into tiny invisible particles — no new matter is made!',
        explanation:
          'Melting ice, boiling water, and dissolving sugar keep the same substance (physical). Lighting matches, frying eggs, spoiling meat, and ripening bananas form new matter (chemical).',
        resourceBonus: 2,
      },
      {
        id: 't11-q5',
        type: 'mcq',
        title: 'Baking Bread: Both Changes Together!',
        prompt:
          'When baking dough into bread in an oven, what are the PHYSICAL and CHEMICAL changes happening?',
        options: [
          'Water evaporating is a physical change; starch and proteins reacting to create brown colour and toasted aroma are chemical changes',
          'Both turning brown and water evaporating are physical changes',
          'Bread can be turned back into raw flour and water',
          'No heat is involved in baking bread',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Look for steam escaping (state change) vs brown crust & toasted smell (new substances)!',
        explanation:
          'During baking, water turns to vapour (physical), while heat makes starch and proteins react into a brown crust and toasted aroma (chemical).',
        resourceBonus: 2,
      },
      {
        id: 't11-q6',
        type: 'mcq',
        title: 'Crumpling vs Burning Paper',
        prompt:
          'How do we tell that burning paper is a chemical change while crumpling paper is a physical change?',
        options: [
          'Crumpling paper creates ash and smoke; burning paper only changes shape',
          'Crumpling only changes shape (still paper); burning produces new substances (ash, water vapour, smoke, gases) and cannot return to paper',
          'Both produce flames and strong odors',
          'Neither change affects the paper at all',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Check whether the substance turns into something completely new like ash and smoke!',
        explanation:
          'Crumpling paper only alters shape (physical). Burning paper produces ash, smoke, and gases that cannot turn back into paper (chemical).',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 12,
    semester: 2,
    topicCode: 'Topic 12',
    title: 'Light and Our Life',
    subtitle: 'Wet-road blurry reflection, shadow formation, and sight ray paths',
    mergedSource: '小時鐘 P4 Topic 12 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'light_prism',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-12',
      name: 'Prism Ray Explorer',
      color: '#a855f7',
      icon: '🪞',
    },
    rewardResource: {
      id: 'prism_quartz',
      name: 'Prism Quartz',
      color: '#c084fc',
      accentColor: '#fef08a',
      icon: '💎',
    },
    sparkyIntro:
      'Why do street lamps blur on wet roads yet shine clearly on calm water? Trace the light rays!',
    quests: [
      {
        id: 't12-q1',
        type: 'mcq',
        title: 'Street Lamps on Smooth Water vs Wet Night Roads',
        prompt:
          'Why does the reflection of a street lamp look sharp on a calm swimming pool, yet blurry and scattered on a rough or wet asphalt road at night?',
        options: [
          'A calm pool is smooth and reflects light regularly, while a rough road scatters reflected light in many directions (diffuse reflection)',
          'Wet roads absorb 100% of light and reflect nothing',
          'Light only reflects off flat glass mirrors and never off water',
          'Rough roads bend light rays into curved spirals',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Smooth surfaces reflect rays evenly to form clear images; rough surfaces bounce rays in all directions!',
        explanation:
          'Smooth surfaces (calm pool, mirror) cause regular reflection producing clear images. Rough surfaces (asphalt road, concrete wall, paper) scatter light in many directions, forming blurred or no images.',
        resourceBonus: 2,
      },
      {
        id: 't12-q2',
        type: 'classify',
        title: 'Light Reflection & Shadow Fact Check',
        prompt:
          'Classify each statement from 小時鐘 Topic 12 True/False exercises into TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Light Fact',
            color: '#16a34a',
            description: 'Accurate optics & safety rule',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Incorrect claim about light or shadows',
          },
        ],
        items: [
          { id: 't12-c1', label: 'Non-luminous objects are visible because they reflect light into our eyes', emoji: '👀', correctCategory: 'true' },
          { id: 't12-c2', label: 'Bicycle reflectors on front, back, wheels & pedals keep night riders safe', emoji: '🚲', correctCategory: 'true' },
          { id: 't12-c3', label: 'Light can only reflect off mirrors and only in 1 fixed direction', emoji: '🚫', correctCategory: 'false' },
          { id: 't12-c4', label: 'Shadows form because light passes straight through opaque objects', emoji: '🌑', correctCategory: 'false' },
        ],
        hint: 'Sparky says: Shadows form when light is BLOCKED (not when it passes through!), and almost every surface reflects light!',
        explanation:
          'Almost all objects reflect light in many directions (allowing us to see desks, walls, and road reflectors!). Shadows form behind opaque objects that BLOCK straight-travelling light.',
        resourceBonus: 2,
      },
      {
        id: 't12-q3',
        type: 'sequence',
        title: 'How Bryan Reads a Science Book',
        prompt:
          'Order the path of light from the light source so Bryan can read his science textbook:',
        items: [
          { id: 'l3', label: 'Book paper scatters & reflects light in many directions', emoji: '📖' },
          { id: 'l1', label: 'A desk lamp or the Sun emits light rays', emoji: '💡' },
          { id: 'l4', label: 'Reflected light enters Bryan’s eyes so he sees the words', emoji: '👁️' },
          { id: 'l2', label: 'Light travels straight and hits the book’s paper surface', emoji: '➡️' },
        ],
        correctOrder: ['l1', 'l2', 'l3', 'l4'],
        hint: 'Sparky says: Source emits → hits book → reflects off paper → enters our eyes!',
        explanation:
          'We see non-luminous objects like books when light from a source hits the object, reflects off its surface, and enters our eyes.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't12-q1',
        type: 'mcq',
        title: 'Street Lamps on Smooth Water vs Wet Night Roads',
        prompt:
          'Why does the reflection of a street lamp look sharp on a calm swimming pool, yet blurry and scattered on a rough or wet asphalt road at night?',
        options: [
          'A calm pool is smooth and reflects light regularly, while a rough road scatters reflected light in many directions (diffuse reflection)',
          'Wet roads absorb 100% of light and reflect nothing',
          'Light only reflects off flat glass mirrors and never off water',
          'Rough roads bend light rays into curved spirals',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Smooth surfaces reflect rays evenly to form clear images; rough surfaces bounce rays in all directions!',
        explanation:
          'Smooth surfaces (calm pool, mirror) cause regular reflection producing clear images. Rough surfaces (asphalt road, concrete wall, paper) scatter light in many directions, forming blurred or no images.',
        resourceBonus: 2,
      },
      {
        id: 't12-q2',
        type: 'classify',
        title: 'Light Reflection & Shadow Fact Check',
        prompt:
          'Classify each statement from 小時鐘 Topic 12 True/False exercises into TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Light Fact',
            color: '#16a34a',
            description: 'Accurate optics & safety rule',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Incorrect claim about light or shadows',
          },
        ],
        items: [
          { id: 't12-c1', label: 'Non-luminous objects are visible because they reflect light into our eyes', emoji: '👀', correctCategory: 'true' },
          { id: 't12-c2', label: 'Bicycle reflectors on front, back, wheels & pedals keep night riders safe', emoji: '🚲', correctCategory: 'true' },
          { id: 't12-c3', label: 'Light can only reflect off mirrors and only in 1 fixed direction', emoji: '🚫', correctCategory: 'false' },
          { id: 't12-c4', label: 'Shadows form because light passes straight through opaque objects', emoji: '🌑', correctCategory: 'false' },
        ],
        hint: 'Sparky says: Shadows form when light is BLOCKED (not when it passes through!), and almost every surface reflects light!',
        explanation:
          'Almost all objects reflect light in many directions (allowing us to see desks, walls, and road reflectors!). Shadows form behind opaque objects that BLOCK straight-travelling light.',
        resourceBonus: 2,
      },
      {
        id: 't12-q3',
        type: 'sequence',
        title: 'How Bryan Reads a Science Book',
        prompt:
          'Order the path of light from the light source so Bryan can read his science textbook:',
        items: [
          { id: 'l3', label: 'Book paper scatters & reflects light in many directions', emoji: '📖' },
          { id: 'l1', label: 'A desk lamp or the Sun emits light rays', emoji: '💡' },
          { id: 'l4', label: 'Reflected light enters Bryan’s eyes so he sees the words', emoji: '👁️' },
          { id: 'l2', label: 'Light travels straight and hits the book’s paper surface', emoji: '➡️' },
        ],
        correctOrder: ['l1', 'l2', 'l3', 'l4'],
        hint: 'Sparky says: Source emits → hits book → reflects off paper → enters our eyes!',
        explanation:
          'We see non-luminous objects like books when light from a source hits the object, reflects off its surface, and enters our eyes.',
        resourceBonus: 2,
      },
      {
        id: 't12-q4',
        type: 'mcq',
        title: 'How Do We See the Moon & Desk Lamps?',
        prompt:
          'Which of the following is NOT a light reflection phenomenon?',
        options: [
          'Seeing the Moon glowing in the night sky',
          'Seeing a desk lamp in a mirror at night',
          'The Sun giving off its own light',
          'Seeing words on a classroom blackboard',
        ],
        correctIndex: 2,
        hint: 'Sparky says: The Sun is a light source itself! Everything else we see reflects light into our eyes!',
        explanation:
          'The Sun produces its own light. We see the Moon, mirrors, and blackboards because they reflect light into our eyes.',
        resourceBonus: 2,
      },
      {
        id: 't12-q5',
        type: 'classify',
        title: 'Smooth vs Rough Surface Reflection',
        prompt:
          'Classify each surface or light behaviour by how it reflects light:',
        categories: [
          {
            id: 'smooth',
            label: 'Smooth Surface (Clear Image)',
            color: '#06b6d4',
            description: 'Reflects light regularly in a specific direction',
          },
          {
            id: 'rough',
            label: 'Rough Surface (Blurred / Diffuse)',
            color: '#f59e0b',
            description: 'Scatters light in many different directions',
          },
        ],
        items: [
          { id: 'lt1', label: 'Calm lake & polished metal mirror', emoji: '🪞', correctCategory: 'smooth' },
          { id: 'lt2', label: 'Car rear-view mirror', emoji: '🚗', correctCategory: 'smooth' },
          { id: 'lt3', label: 'Wet asphalt road at night (blurry lamp reflection)', emoji: '🛣️', correctCategory: 'rough' },
          { id: 'lt4', label: 'Concrete wall, frosted glass & textbook page', emoji: '🧱', correctCategory: 'rough' },
        ],
        hint: 'Sparky says: The smoother the surface, the more regularly light reflects and the clearer the image!',
        explanation:
          'Smooth surfaces reflect light regularly to form clear images; rough surfaces scatter light in many directions.',
        resourceBonus: 2,
      },
      {
        id: 't12-q6',
        type: 'mcq',
        title: 'Shadows & Night Cycling Safety',
        prompt:
          'How are shadows formed, AND how should a cyclist stay visible at night using light reflection?',
        options: [
          'Shadows form when light passes straight through objects; cyclists should wear all black',
          'Shadows form behind an opaque object that blocks light; cyclists should use reflectors on wheels/pedals/front/back and reflective strips',
          'Light only reflects on mirrors and never reflects off road signs',
          'Light only travels in curves around obstacles',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Without light reflection, we could ONLY see light sources themselves!',
        explanation:
          'Shadows form when an object blocks light. Bicycle reflectors and reflective vests bounce car headlights back to drivers.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 13,
    semester: 2,
    topicCode: 'Topic 13',
    title: 'Friction in Action',
    subtitle: 'Ice skate blade physics, friction myths, and surface comparison',
    mergedSource: '小時鐘 P4 Topic 13 (2nd Semester)',
    focusDomain: 'Matter, Energy & Inquiry',
    biome: 'friction_track',
    timeLimitSeconds: 150,
    badge: {
      id: 'badge-topic-13',
      name: 'Force & Motion Ace',
      color: '#0d9488',
      icon: '⛸️',
    },
    rewardResource: {
      id: 'friction_wheel',
      name: 'Precision Roller Wheel',
      color: '#14b8a6',
      accentColor: '#99f6e4',
      icon: '🛞',
    },
    sparkyIntro:
      'Glide on ice skates, brake with the blade edge, and rank friction from ice to rough sand!',
    quests: [
      {
        id: 't13-q1',
        type: 'mcq',
        title: 'How Ice Skates Both Glide Fast & Stop Safely',
        prompt:
          'How does a single pair of ice skates let skaters glide smoothly at high speed AND still stop safely on slippery ice?',
        options: [
          'Smooth thin metal blades reduce friction for gliding; tilting the blade edge or digging in the toe teeth increases friction to stop safely',
          'Ice skates spray oil onto the ice to speed up friction',
          'Friction pushes skaters forward at constant speed without touching the ice',
          'Wide rubber soles replace the blades whenever skaters want to glide',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Flat smooth steel = tiny friction to glide; tilted blade edge or toe pick = big friction to brake!',
        explanation:
          'Ice skates are a clever dual-friction tool: their smooth, narrow steel blades minimize contact friction for gliding, while angling the edge or toe teeth digs into the ice to boost friction and brake.',
        resourceBonus: 2,
      },
      {
        id: 't13-q2',
        type: 'classify',
        title: 'Friction Rules & Misconception Lab',
        prompt:
          'Classify each statement from 小時鐘 Topic 13 True/False exercises as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Physics Fact',
            color: '#16a34a',
            description: 'Matches how contact friction works',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Incorrect idea about friction',
          },
        ],
        items: [
          { id: 't13-c1', label: 'Friction only occurs when two surfaces touch and acts opposite to motion', emoji: '↔️', correctCategory: 'true' },
          { id: 't13-c2', label: 'Using suitcase wheels replaces sliding with smaller rolling friction', emoji: '🧳', correctCategory: 'true' },
          { id: 't13-c3', label: 'Friction can speed up a moving box or keep its speed constant', emoji: '🚀', correctCategory: 'false' },
          { id: 't13-c4', label: 'Painting a wooden ramp a brighter colour reduces friction', emoji: '🎨', correctCategory: 'false' },
        ],
        hint: 'Sparky says: Friction slows objects down and stops them — it NEVER speeds them up! And colour has zero effect on friction!',
        explanation:
          'Friction acts only between touching surfaces, always opposing motion to slow/stop objects (never speeding them up). Weight and surface roughness affect friction — colour does not.',
        resourceBonus: 2,
      },
      {
        id: 't13-q3',
        type: 'sequence',
        title: 'Comparing Friction: Smallest to Largest',
        prompt:
          'Order these 4 situations from SMALLEST friction (easiest to move) to LARGEST friction (hardest to push):',
        items: [
          { id: 'f3', label: 'Pushing a 10 kg crate across a wooden board', emoji: '📦' },
          { id: 'f1', label: 'Steel ice-skate blade gliding on smooth ice', emoji: '⛸️' },
          { id: 'f4', label: 'Pushing a 50 kg crate across rough sand', emoji: '🏖️' },
          { id: 'f2', label: 'Pulling a suitcase rolling on wheels across tiles', emoji: '🧳' },
        ],
        correctOrder: ['f1', 'f2', 'f3', 'f4'],
        hint: 'Sparky says: Smooth ice < rolling wheels < light sliding on wood < heavy sliding on rough sand!',
        explanation:
          'Friction grows with heavier weight and rougher surfaces, while rolling and ultra-smooth ice minimize friction: Ice skate on ice → Rolling suitcase → 10 kg on wood → 50 kg on rough sand.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't13-q1',
        type: 'mcq',
        title: 'How Ice Skates Both Glide Fast & Stop Safely',
        prompt:
          'How does a single pair of ice skates let skaters glide smoothly at high speed AND still stop safely on slippery ice?',
        options: [
          'Smooth thin metal blades reduce friction for gliding; tilting the blade edge or digging in the toe teeth increases friction to stop safely',
          'Ice skates spray oil onto the ice to speed up friction',
          'Friction pushes skaters forward at constant speed without touching the ice',
          'Wide rubber soles replace the blades whenever skaters want to glide',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Flat smooth steel = tiny friction to glide; tilted blade edge or toe pick = big friction to brake!',
        explanation:
          'Ice skates are a clever dual-friction tool: their smooth, narrow steel blades minimize contact friction for gliding, while angling the edge or toe teeth digs into the ice to boost friction and brake.',
        resourceBonus: 2,
      },
      {
        id: 't13-q2',
        type: 'classify',
        title: 'Friction Rules & Misconception Lab',
        prompt:
          'Classify each statement from 小時鐘 Topic 13 True/False exercises as TRUE or FALSE:',
        categories: [
          {
            id: 'true',
            label: 'True Physics Fact',
            color: '#16a34a',
            description: 'Matches how contact friction works',
          },
          {
            id: 'false',
            label: 'False Myth',
            color: '#dc2626',
            description: 'Incorrect idea about friction',
          },
        ],
        items: [
          { id: 't13-c1', label: 'Friction only occurs when two surfaces touch and acts opposite to motion', emoji: '↔️', correctCategory: 'true' },
          { id: 't13-c2', label: 'Using suitcase wheels replaces sliding with smaller rolling friction', emoji: '🧳', correctCategory: 'true' },
          { id: 't13-c3', label: 'Friction can speed up a moving box or keep its speed constant', emoji: '🚀', correctCategory: 'false' },
          { id: 't13-c4', label: 'Painting a wooden ramp a brighter colour reduces friction', emoji: '🎨', correctCategory: 'false' },
        ],
        hint: 'Sparky says: Friction slows objects down and stops them — it NEVER speeds them up! And colour has zero effect on friction!',
        explanation:
          'Friction acts only between touching surfaces, always opposing motion to slow/stop objects (never speeding them up). Weight and surface roughness affect friction — colour does not.',
        resourceBonus: 2,
      },
      {
        id: 't13-q3',
        type: 'sequence',
        title: 'Comparing Friction: Smallest to Largest',
        prompt:
          'Order these 4 situations from SMALLEST friction (easiest to move) to LARGEST friction (hardest to push):',
        items: [
          { id: 'f3', label: 'Pushing a 10 kg crate across a wooden board', emoji: '📦' },
          { id: 'f1', label: 'Steel ice-skate blade gliding on smooth ice', emoji: '⛸️' },
          { id: 'f4', label: 'Pushing a 50 kg crate across rough sand', emoji: '🏖️' },
          { id: 'f2', label: 'Pulling a suitcase rolling on wheels across tiles', emoji: '🧳' },
        ],
        correctOrder: ['f1', 'f2', 'f3', 'f4'],
        hint: 'Sparky says: Smooth ice < rolling wheels < light sliding on wood < heavy sliding on rough sand!',
        explanation:
          'Friction grows with heavier weight and rougher surfaces, while rolling and ultra-smooth ice minimize friction: Ice skate on ice → Rolling suitcase → 10 kg on wood → 50 kg on rough sand.',
        resourceBonus: 2,
      },
      {
        id: 't13-q4',
        type: 'mcq',
        title: 'Direction & Effect of Friction',
        prompt:
          'When a boy pushes a box to the RIGHT across the floor, which direction does friction act, and what CANNOT friction do?',
        options: [
          'Acts to the LEFT (opposite to motion); friction cannot speed an object up',
          'Acts to the RIGHT (same as motion); friction speeds the box up',
          'Acts upward into the air; friction only happens without contact',
          'Acts in circles; friction never stops moving objects',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Friction always acts OPPOSITE to motion!',
        explanation:
          'Friction acts opposite to motion, slowing objects down and stopping them — it cannot speed objects up.',
        resourceBonus: 2,
      },
      {
        id: 't13-q5',
        type: 'mcq',
        title: '10 kg Box vs 50 kg Box & Ice Rink',
        prompt:
          'Which box is easier to push, AND in which situation is friction the SMALLEST?',
        options: [
          '50 kg box is easier; running on sand has smallest friction',
          '10 kg box is easier (less weight = less friction between surfaces); sliding on smooth ice has the smallest friction',
          'Both boxes have equal friction; wooden board has smallest friction',
          'Coloring the surface increases friction',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Heavier objects press harder onto the ground, increasing friction; smoother surfaces reduce friction!',
        explanation:
          'Greater weight and rougher surfaces increase friction. A 10 kg box creates less friction than a 50 kg box, and smooth ice has much smaller friction than sand.',
        resourceBonus: 2,
      },
      {
        id: 't13-q6',
        type: 'classify',
        title: 'Increasing vs Reducing Friction in Daily Life',
        prompt:
          'Sort each everyday design into whether it INCREASES friction (for grip) or REDUCES friction (for smooth gliding):',
        categories: [
          {
            id: 'increase',
            label: 'Increases Friction (Grip)',
            color: '#f97316',
            description: 'Prevents slipping & helps hold objects',
          },
          {
            id: 'reduce',
            label: 'Reduces Friction (Smooth)',
            color: '#06b6d4',
            description: 'Makes moving & sliding much easier',
          },
        ],
        items: [
          { id: 'fr1', label: 'Uneven shoe sole patterns & car tyre treads', emoji: '👟', correctCategory: 'increase' },
          { id: 'fr2', label: 'Sports glove grips & ice skate blade edge digging in to stop', emoji: '🧤', correctCategory: 'increase' },
          { id: 'fr3', label: 'Suitcase rolling wheels (rolling < sliding friction)', emoji: '🧳', correctCategory: 'reduce' },
          { id: 'fr4', label: 'Smooth metal ice-skate blades gliding on smooth ice', emoji: '⛸️', correctCategory: 'reduce' },
        ],
        hint: 'Sparky says: Suitcase wheels change sliding friction into rolling friction, which is much smaller!',
        explanation:
          'Shoe soles, tyre treads, and gloves increase friction for grip; rolling wheels and smooth ice-skate blades reduce friction.',
        resourceBonus: 2,
      },
    ],
  },
  {
    id: 14,
    semester: 2,
    topicCode: 'Topic 14',
    title: 'Space Technology Today',
    subtitle: 'Chinese aerospace programs, spacesuits, pioneer astronauts & spinoffs',
    mergedSource: '小時鐘 P4 Topic 14 (2nd Semester)',
    focusDomain: 'Earth & Space',
    biome: 'space_station',
    timeLimitSeconds: 160,
    badge: {
      id: 'badge-topic-14',
      name: 'Tiangong Space Commander',
      color: '#6366f1',
      icon: '🚀',
    },
    rewardResource: {
      id: 'starlight_titanium',
      name: 'Starlight Titanium',
      color: '#818cf8',
      accentColor: '#e0e7ff',
      icon: '🛰️',
    },
    sparkyIntro:
      'Final Launch! Classify China’s aerospace programs, inspect spacesuit protection, and spot everyday space spinoffs!',
    quests: [
      {
        id: 't14-q1',
        type: 'classify',
        title: 'Chinese Aerospace Programs Classifier',
        prompt:
          'Classify each famous mission from 小時鐘 Topic 14 into Manned Spaceflight, Artificial Satellites, or Deep-Space Exploration:',
        categories: [
          {
            id: 'manned',
            label: 'Manned Spaceflight',
            color: '#ef4444',
            description: 'Carrying astronauts into orbit & Tiangong Station',
          },
          {
            id: 'satellite',
            label: 'Artificial Satellite',
            color: '#3b82f6',
            description: 'Unmanned spacecraft orbiting Earth',
          },
          {
            id: 'deep_space',
            label: 'Deep-Space Exploration',
            color: '#8b5cf6',
            description: 'Probing the Moon, Mars & beyond',
          },
        ],
        items: [
          { id: 't14-c1', label: 'Shenzhou-5/7 & Tiangong Space Station', emoji: '👨‍🚀', correctCategory: 'manned' },
          { id: 't14-c2', label: 'Dongfanghong-1 (1970) & BeiDou Navigation Satellites', emoji: '🛰️', correctCategory: 'satellite' },
          { id: 't14-c3', label: 'Chang’e-1/3/5/6 (Moon exploration & far-side samples)', emoji: '🌕', correctCategory: 'deep_space' },
          { id: 't14-c4', label: 'Tianwen-1 & Zhurong Mars Rover', emoji: '🔴', correctCategory: 'deep_space' },
        ],
        hint: 'Sparky says: Shenzhou & Tiangong carry astronauts (manned); Dongfanghong-1 & BeiDou orbit Earth (satellites); Chang’e & Tianwen-1 explore Moon & Mars!',
        explanation:
          'China’s space achievements span Manned Spaceflight (Shenzhou-5/7, Tiangong), Artificial Satellites (Dongfanghong-1, BeiDou), and Deep-Space Exploration (Chang’e lunar probes, Tianwen-1 Zhurong Mars rover).',
        resourceBonus: 3,
      },
      {
        id: 't14-q2',
        type: 'mcq',
        title: 'Pioneer Astronauts & Spacesuit Engineering',
        prompt:
          'Who was the first Chinese astronaut in space (2003) and who gave live zero-gravity science lessons from space, AND how does a spacesuit protect astronauts outside?',
        options: [
          'Yang Liwei was 1st in space and Wang Yaping taught space science lessons; spacesuits supply oxygen, insulate extreme heat/cold, block radiation & dust, and protect the head',
          'Dongfanghong-1 was an astronaut; spacesuits only keep hair tidy inside the cabin',
          'Chang’e-6 carried Yang Liwei to Mars; astronauts breathe empty vacuum outside',
          'Wang Yaping walked on the Moon in 1970 without a helmet',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Remember Topic 14’s heroes: Yang Liwei (Shenzhou-5, 2003) and Wang Yaping (space classroom)!',
        explanation:
          'Yang Liwei flew China’s first manned mission (Shenzhou-5, 2003) and Wang Yaping became China’s first space teacher. Extravehicular spacesuits supply oxygen, regulate temperature, shield harmful radiation/dust, and protect the head.',
        resourceBonus: 3,
      },
      {
        id: 't14-q3',
        type: 'mcq',
        title: 'Everyday Space Spinoff Inventions',
        prompt:
          'Which set of everyday products originated from or was improved by space technology research (小時鐘 Topic 14)?',
        options: [
          'Scratch-resistant sunglasses, air-cushioned trainers, thermos bottles, squeezable food pouches & water-purification filters',
          'Steam locomotives, wooden ox carts & oil-burning torches',
          'Sandstone chalkboards and clay flowerpots',
          'Single-use plastic forks and leaded petrol',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Think about tough visor coatings, shock-absorbing boots, vacuum insulation, paste tubes, and recycled water!',
        explanation:
          'Space engineering gave us scratch-resistant sunglasses, air-cushioned trainers, vacuum thermos bottles, squeezable pouches, and advanced water-purification filters.',
        resourceBonus: 2,
      },
    ],
    questBank: [
      {
        id: 't14-q1',
        type: 'classify',
        title: 'Chinese Aerospace Programs Classifier',
        prompt:
          'Classify each famous mission from 小時鐘 Topic 14 into Manned Spaceflight, Artificial Satellites, or Deep-Space Exploration:',
        categories: [
          {
            id: 'manned',
            label: 'Manned Spaceflight',
            color: '#ef4444',
            description: 'Carrying astronauts into orbit & Tiangong Station',
          },
          {
            id: 'satellite',
            label: 'Artificial Satellite',
            color: '#3b82f6',
            description: 'Unmanned spacecraft orbiting Earth',
          },
          {
            id: 'deep_space',
            label: 'Deep-Space Exploration',
            color: '#8b5cf6',
            description: 'Probing the Moon, Mars & beyond',
          },
        ],
        items: [
          { id: 't14-c1', label: 'Shenzhou-5/7 & Tiangong Space Station', emoji: '👨‍🚀', correctCategory: 'manned' },
          { id: 't14-c2', label: 'Dongfanghong-1 (1970) & BeiDou Navigation Satellites', emoji: '🛰️', correctCategory: 'satellite' },
          { id: 't14-c3', label: 'Chang’e-1/3/5/6 (Moon exploration & far-side samples)', emoji: '🌕', correctCategory: 'deep_space' },
          { id: 't14-c4', label: 'Tianwen-1 & Zhurong Mars Rover', emoji: '🔴', correctCategory: 'deep_space' },
        ],
        hint: 'Sparky says: Shenzhou & Tiangong carry astronauts (manned); Dongfanghong-1 & BeiDou orbit Earth (satellites); Chang’e & Tianwen-1 explore Moon & Mars!',
        explanation:
          'China’s space achievements span Manned Spaceflight (Shenzhou-5/7, Tiangong), Artificial Satellites (Dongfanghong-1, BeiDou), and Deep-Space Exploration (Chang’e lunar probes, Tianwen-1 Zhurong Mars rover).',
        resourceBonus: 3,
      },
      {
        id: 't14-q2',
        type: 'mcq',
        title: 'Pioneer Astronauts & Spacesuit Engineering',
        prompt:
          'Who was the first Chinese astronaut in space (2003) and who gave live zero-gravity science lessons from space, AND how does a spacesuit protect astronauts outside?',
        options: [
          'Yang Liwei was 1st in space and Wang Yaping taught space science lessons; spacesuits supply oxygen, insulate extreme heat/cold, block radiation & dust, and protect the head',
          'Dongfanghong-1 was an astronaut; spacesuits only keep hair tidy inside the cabin',
          'Chang’e-6 carried Yang Liwei to Mars; astronauts breathe empty vacuum outside',
          'Wang Yaping walked on the Moon in 1970 without a helmet',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Remember Topic 14’s heroes: Yang Liwei (Shenzhou-5, 2003) and Wang Yaping (space classroom)!',
        explanation:
          'Yang Liwei flew China’s first manned mission (Shenzhou-5, 2003) and Wang Yaping became China’s first space teacher. Extravehicular spacesuits supply oxygen, regulate temperature, shield harmful radiation/dust, and protect the head.',
        resourceBonus: 3,
      },
      {
        id: 't14-q3',
        type: 'mcq',
        title: 'Everyday Space Spinoff Inventions',
        prompt:
          'Which set of everyday products originated from or was improved by space technology research (小時鐘 Topic 14)?',
        options: [
          'Scratch-resistant sunglasses, air-cushioned trainers, thermos bottles, squeezable food pouches & water-purification filters',
          'Steam locomotives, wooden ox carts & oil-burning torches',
          'Sandstone chalkboards and clay flowerpots',
          'Single-use plastic forks and leaded petrol',
        ],
        correctIndex: 0,
        hint: 'Sparky says: Think about tough visor coatings, shock-absorbing boots, vacuum insulation, paste tubes, and recycled water!',
        explanation:
          'Space engineering gave us scratch-resistant sunglasses, air-cushioned trainers, vacuum thermos bottles, squeezable pouches, and advanced water-purification filters.',
        resourceBonus: 2,
      },
      {
        id: 't14-q4',
        type: 'classify',
        title: '5 Types of Artificial Satellites',
        prompt:
          'Match each satellite mission to the correct type of unmanned spacecraft orbiting Earth:',
        categories: [
          {
            id: 'comm_nav',
            label: 'Communication / Navigation',
            color: '#3b82f6',
            description: 'Wi-Fi, TV, phone signals, GPS/BeiDou maps',
          },
          {
            id: 'weather_earth',
            label: 'Weather / Earth Observation',
            color: '#10b981',
            description: 'Typhoon tracking, forest fires, oceans',
          },
          {
            id: 'science',
            label: 'Scientific Research',
            color: '#8b5cf6',
            description: 'Probing Moon, Mars, Sun & universe',
          },
        ],
        items: [
          { id: 'sat1', label: 'Transmitting TV/Wi-Fi & BeiDou map navigation', emoji: '📡', correctCategory: 'comm_nav' },
          { id: 'sat2', label: 'Tracking typhoon paths, rain & temperature', emoji: '🌀', correctCategory: 'weather_earth' },
          { id: 'sat3', label: 'Detecting forest fires & monitoring crops/oceans', emoji: '🌍', correctCategory: 'weather_earth' },
          { id: 'sat4', label: 'Probing Mars, the Moon & studying the Sun', emoji: '🔭', correctCategory: 'science' },
        ],
        hint: 'Sparky says: An artificial satellite is an unmanned spacecraft sent into space by rocket to orbit Earth!',
        explanation:
          'The 5 satellite types are: Communication, Weather, Navigation, Earth observation, and Scientific research.',
        resourceBonus: 2,
      },
      {
        id: 't14-q5',
        type: 'sequence',
        title: 'Aerospace Milestones Timeline',
        prompt:
          'Order these historic aerospace milestones from EARLIEST (1970) to LATEST (2024):',
        items: [
          { id: 'm2003', label: '2003: Shenzhou-5 (Yang Liwei — 1st manned spaceflight)', emoji: '👨‍🚀' },
          { id: 'm1970', label: '1970: Dongfanghong-1 (1st artificial satellite)', emoji: '🛰️' },
          { id: 'm2024', label: '2024: Chang’e-6 (1st samples from far side of the Moon)', emoji: '🌕' },
          { id: 'm2011', label: '2011–2021: Tiangong-1, Chang’e-3/5 & Tianwen-1 Mars Rover', emoji: '🔴' },
        ],
        correctOrder: ['m1970', 'm2003', 'm2011', 'm2024'],
        hint: 'Sparky says: 1970 satellite → 2003 Shenzhou-5 → 2011 Tiangong & 2021 Tianwen-1 Mars → 2024 Chang’e-6!',
        explanation:
          '1970: Dongfanghong-1 → 2003: Shenzhou-5 → 2011–2021: Tiangong & Tianwen-1 → 2024: Chang’e-6 far-side lunar samples.',
        resourceBonus: 3,
      },
      {
        id: 't14-q6',
        type: 'mcq',
        title: 'Life in Zero Gravity & Space Spinoffs',
        prompt:
          'How do astronauts eat, sleep, and stay healthy inside a microgravity space station?',
        options: [
          'They eat soup with bowls and chopsticks, sleep floating freely, and never exercise',
          'They eat vacuum-sealed paste food and drink from bags with straws, strap sleeping bags to walls, and exercise daily to prevent weak muscles/bones',
          'Spacesuits have no oxygen and are only for decoration',
          'Scratch-resistant sunglasses and water-purification filters were never inspired by space tech',
        ],
        correctIndex: 1,
        hint: 'Sparky says: Without gravity, food floats away! Astronauts strap sleeping bags to walls and exercise daily.',
        explanation:
          'In space, astronauts eat vacuum-sealed food, drink via straws from bags, strap sleeping bags to walls, and exercise daily.',
        resourceBonus: 3,
      },
    ],
  },
];
