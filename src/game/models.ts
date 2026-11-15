import * as THREE from 'three';
import type { BiomeType, HeroCharacter, TopicStage } from '../types/game';

export interface AnimatedActorRefs {
  root: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  flameGroup: THREE.Group;
  bodyGroup: THREE.Group;
}

export interface SparkyRefs {
  root: THREE.Group;
  coreGroup: THREE.Group;
  tailFlame: THREE.Mesh;
  orbitSparks: THREE.Mesh[];
}

export interface BeaconRefs {
  root: THREE.Group;
  crystal: THREE.Group;
  beam: THREE.Mesh;
  ring: THREE.Mesh;
  baseGlow: THREE.Mesh;
  hitMesh: THREE.Mesh;
}

/**
 * Builds Bryan or Caden — the Fire Match Boys!
 * Composite 11-part Minecraft-style voxel character with wooden matchstick head,
 * glowing phosphorus match-tip, animated flame crest, explorer tunic, boots & prop.
 * Pivoted strictly at bottom-center (y = 0).
 */
export function buildMatchBoyModel(character: HeroCharacter): AnimatedActorRefs {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const isBryan = character === 'bryan';

  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.05,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xf3d2a2,
    roughness: 0.8,
    metalness: 0.0,
  });
  const tunicMat = new THREE.MeshStandardMaterial({
    color: isBryan ? 0xdc2626 : 0x2563eb,
    roughness: 0.65,
    metalness: 0.08,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: isBryan ? 0xfbbf24 : 0x38bdf8,
    roughness: 0.3,
    metalness: 0.55,
  });
  const matchTipMat = new THREE.MeshStandardMaterial({
    color: isBryan ? 0xb91c1c : 0x0284c7,
    roughness: 0.5,
    metalness: 0.05,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.2,
    metalness: 0.1,
  });
  const flameOuterMat = new THREE.MeshStandardMaterial({
    color: isBryan ? 0xf97316 : 0x06b6d4,
    emissive: isBryan ? 0xea580c : 0x0ea5e9,
    emissiveIntensity: 1.2,
    roughness: 0.25,
  });
  const flameInnerMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });

  // 1 & 2: Left & Right Legs (pivoted at hip y = 0.6)
  const legGeo = new THREE.BoxGeometry(0.26, 0.58, 0.28);
  const leftLeg = new THREE.Mesh(legGeo, bootMat);
  leftLeg.position.set(-0.16, 0.29, 0);
  leftLeg.castShadow = true;
  bodyGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, bootMat);
  rightLeg.position.set(0.16, 0.29, 0);
  rightLeg.castShadow = true;
  bodyGroup.add(rightLeg);

  // 3: Torso Tunic
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.34), tunicMat);
  torso.position.set(0, 0.94, 0);
  torso.castShadow = true;
  bodyGroup.add(torso);

  // 4: Metallic Explorer Belt / Buckle Accent
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.12, 0.38), trimMat);
  belt.position.set(0, 0.68, 0);
  bodyGroup.add(belt);

  // 5 & 6: Left & Right Arms
  const armGeo = new THREE.BoxGeometry(0.22, 0.62, 0.24);
  const leftArm = new THREE.Mesh(armGeo, woodMat);
  leftArm.position.set(-0.44, 0.96, 0);
  leftArm.castShadow = true;
  bodyGroup.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, woodMat);
  rightArm.position.set(0.44, 0.96, 0);
  rightArm.castShadow = true;
  bodyGroup.add(rightArm);

  // Held Science Tool in Right Hand (Ember Torch for Bryan, Explorer Lens for Caden)
  const propStick = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.42, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }),
  );
  propStick.position.set(0, -0.24, 0.18);
  propStick.rotation.x = Math.PI / 3;
  rightArm.add(propStick);

  const propTip = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.16, 0.16),
    isBryan ? flameInnerMat : trimMat,
  );
  propTip.position.set(0, -0.14, 0.34);
  rightArm.add(propTip);

  // 7: Wooden Matchstick Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.56, 0.56), woodMat);
  head.position.set(0, 1.58, 0);
  head.castShadow = true;
  bodyGroup.add(head);

  // 8: Eyes (+Z is forward)
  const eyeGeo = new THREE.BoxGeometry(0.09, 0.12, 0.05);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.13, 1.56, 0.28);
  bodyGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.13, 1.56, 0.28);
  bodyGroup.add(rightEye);

  // Caden wears explorer goggles band; Bryan wears a bright flame bandana
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), trimMat);
  band.position.set(0, 1.72, 0);
  bodyGroup.add(band);

  // 9: Phosphorus Match-Head Cap
  const matchCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.28, 0.62),
    matchTipMat,
  );
  matchCap.position.set(0, 1.94, 0);
  matchCap.castShadow = true;
  bodyGroup.add(matchCap);

  // 10 & 11: Animated Flame Hair Crest
  const flameGroup = new THREE.Group();
  flameGroup.position.set(0, 2.1, 0);
  bodyGroup.add(flameGroup);

  const flameBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.34, 0.42),
    flameOuterMat,
  );
  flameBase.position.y = 0.17;
  flameGroup.add(flameBase);

  const flameCore = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.28, 0.24),
    flameInnerMat,
  );
  flameCore.position.y = 0.34;
  flameGroup.add(flameCore);

  return {
    root,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    flameGroup,
    bodyGroup,
  };
}

/**
 * Builds Sparky — Bryan & Caden's floating blocky fire-wisp companion!
 */
export function buildSparkyCompanion(): SparkyRefs {
  const root = new THREE.Group();
  const coreGroup = new THREE.Group();
  root.add(coreGroup);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.7,
    roughness: 0.35,
  });
  const bellyMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.9,
    roughness: 0.25,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.15,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.44, 0.46), bodyMat);
  body.castShadow = true;
  coreGroup.add(body);

  const facePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.28, 0.06),
    bellyMat,
  );
  facePlate.position.set(0, -0.02, 0.22);
  coreGroup.add(facePlate);

  const earGeo = new THREE.BoxGeometry(0.14, 0.22, 0.12);
  const leftEar = new THREE.Mesh(earGeo, bodyMat);
  leftEar.position.set(-0.16, 0.3, 0);
  leftEar.rotation.z = 0.2;
  coreGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, bodyMat);
  rightEar.position.set(0.16, 0.3, 0);
  rightEar.rotation.z = -0.2;
  coreGroup.add(rightEar);

  const eyeGeo = new THREE.BoxGeometry(0.08, 0.1, 0.04);
  const lEye = new THREE.Mesh(eyeGeo, eyeMat);
  lEye.position.set(-0.1, 0.04, 0.25);
  coreGroup.add(lEye);

  const rEye = new THREE.Mesh(eyeGeo, eyeMat);
  rEye.position.set(0.1, 0.04, 0.25);
  coreGroup.add(rEye);

  const tailFlame = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.24, 0.26),
    bellyMat,
  );
  tailFlame.position.set(0, 0.08, -0.32);
  coreGroup.add(tailFlame);

  const orbitSparks: THREE.Mesh[] = [];
  const sparkGeo = new THREE.BoxGeometry(0.11, 0.11, 0.11);
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(sparkGeo, bellyMat);
    orbitSparks.push(s);
    coreGroup.add(s);
  }

  return { root, coreGroup, tailFlame, orbitSparks };
}

/**
 * Builds a composite Quest Beacon Pedestal (5 parts + hit proxy)
 */
export function buildQuestBeacon(
  accentHex: string,
  index: number,
): BeaconRefs {
  const root = new THREE.Group();

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
    metalness: 0.1,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.6,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 1.1,
    roughness: 0.2,
  });

  // 1: Wide plinth base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.8), stoneMat);
  base.position.y = 0.15;
  base.receiveShadow = true;
  base.castShadow = true;
  root.add(base);

  // 2: Stepped collar
  const collar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 1.2), trimMat);
  collar.position.y = 0.475;
  collar.castShadow = true;
  root.add(collar);

  // 3: Glowing core pad
  const baseGlow = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.9), glowMat);
  baseGlow.position.y = 0.7;
  root.add(baseGlow);

  // 4: Vertical Energy Beam
  const beamMat = new THREE.MeshBasicMaterial({
    color: accentHex,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.8, 0.32), beamMat);
  beam.position.y = 3.1;
  root.add(beam);

  // 5: Floating Rotating Science Crystal (3-part composite)
  const crystal = new THREE.Group();
  crystal.position.y = 1.65;
  const cCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), glowMat);
  crystal.add(cCore);
  const cRing = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.1, 0.68),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      metalness: 0.75,
    }),
  );
  crystal.add(cRing);
  root.add(crystal);

  // 6: Ground aura ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.15, 1.38, 24),
    new THREE.MeshBasicMaterial({
      color: accentHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  root.add(ring);

  // Invisible simplified raycast hit box
  const hitMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 3.2, 2.2),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitMesh.position.y = 1.6;
  hitMesh.userData = { beaconIndex: index };
  hitMesh.layers.set(1);
  root.add(hitMesh);

  return { root, crystal, beam, ring, baseGlow, hitMesh };
}

/**
 * Builds a collectible Minecraft-style floating Resource Crate
 */
export function buildResourcePickup(colorHex: string, accentHex: string): THREE.Group {
  const group = new THREE.Group();
  const mainMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.3,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    roughness: 0.25,
    metalness: 0.65,
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), mainMat);
  cube.position.y = 0.75;
  cube.castShadow = true;
  group.add(cube);

  const band1 = new THREE.Mesh(new THREE.BoxGeometry(0.61, 0.14, 0.61), frameMat);
  band1.position.y = 0.75;
  group.add(band1);

  const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.61, 0.61), frameMat);
  band2.position.y = 0.75;
  group.add(band2);

  return group;
}

/**
 * Builds a composite Minecraft-style Voxel Tree (trunk + 2-3 stepped leaf canopies)
 */
export function buildVoxelTree(
  trunkColor: number,
  leafPrimary: number,
  leafSecondary: number,
  scale = 1,
): THREE.Group {
  const group = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({
    color: trunkColor,
    roughness: 0.9,
  });
  const leafMat1 = new THREE.MeshStandardMaterial({
    color: leafPrimary,
    roughness: 0.72,
  });
  const leafMat2 = new THREE.MeshStandardMaterial({
    color: leafSecondary,
    roughness: 0.65,
  });

  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), trunkMat);
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  const canopy1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.1, 2.3), leafMat1);
  canopy1.position.y = 2.55;
  canopy1.castShadow = true;
  group.add(canopy1);

  const canopy2 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.95, 1.7), leafMat2);
  canopy2.position.y = 3.5;
  canopy2.castShadow = true;
  group.add(canopy2);

  const canopyTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.7, 0.95), leafMat1);
  canopyTop.position.y = 4.25;
  canopyTop.castShadow = true;
  group.add(canopyTop);

  group.scale.setScalar(scale);
  return group;
}

/**
 * Builds a tall signature 3D Landmark Monument matching the Topic's Biome
 * Framed cleanly in the initial spawn camera view!
 */
export function buildTopicLandmark(biome: BiomeType): THREE.Group {
  const group = new THREE.Group();

  const stoneBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.7, 4.4),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 }),
  );
  stoneBase.position.y = 0.35;
  stoneBase.receiveShadow = true;
  stoneBase.castShadow = true;
  group.add(stoneBase);

  if (biome === 'earth_crust') {
    // Cutaway Earth Crust / Mantle / Core Monument with clean stepped offsets
    const crust = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.5, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.88 }),
    );
    crust.position.y = 1.95;
    crust.castShadow = true;
    group.add(crust);

    const grassCap = new THREE.Mesh(
      new THREE.BoxGeometry(3.35, 0.42, 3.35),
      new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.75 }),
    );
    grassCap.position.y = 3.41;
    group.add(grassCap);

    const mantle = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.85, 2.1),
      new THREE.MeshStandardMaterial({
        color: 0xea580c,
        emissive: 0xc2410c,
        emissiveIntensity: 0.85,
        roughness: 0.4,
      }),
    );
    mantle.position.set(0.75, 1.95, 0.75);
    group.add(mantle);

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.15, 1.15),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xfef08a,
        emissiveIntensity: 1.25,
        roughness: 0.2,
        metalness: 0.6,
      }),
    );
    core.position.set(1.38, 1.98, 1.38);
    group.add(core);
  } else if (biome === 'solar_orbit' || biome === 'space_station') {
    // Giant Voxel Globe + Orbiting Satellite / Sun
    const earth = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 1),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }),
    );
    earth.position.set(0, 2.8, 0);
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    earth.castShadow = true;
    group.add(earth);

    const continent = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.9, 1.9),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 }),
    );
    continent.position.set(0.35, 2.95, 0.35);
    group.add(continent);

    const sunOrb = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.3,
        roughness: 0.2,
      }),
    );
    sunOrb.position.set(-2.1, 3.8, 0.6);
    group.add(sunOrb);

    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.55, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 }),
    );
    satBody.position.set(2.0, 3.9, 0.5);
    group.add(satBody);

    const solarWing = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.08, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.25 }),
    );
    solarWing.position.set(2.0, 3.9, 0.5);
    group.add(solarWing);
  } else if (biome === 'cellular_lab') {
    // Giant 3D Voxel Biological Cell Model (Membrane + Cytoplasm + Nucleus + Pathogens!)
    const membrane = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.8, 3.4),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.42,
        roughness: 0.15,
        depthWrite: false,
      }),
    );
    membrane.position.y = 2.2;
    group.add(membrane);

    const nucleus = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        emissiveIntensity: 0.65,
        roughness: 0.35,
      }),
    );
    nucleus.position.y = 2.25;
    nucleus.castShadow = true;
    group.add(nucleus);

    const mitoMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.45,
    });
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), mitoMat);
      const ang = (i * Math.PI) / 2;
      m.position.set(Math.cos(ang) * 1.15, 1.7 + (i % 2) * 0.8, Math.sin(ang) * 1.15);
      m.rotation.y = ang;
      group.add(m);
    }

    // Dividing tumour-warning cube floating outside
    const pathogen = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        emissive: 0xbe123c,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      }),
    );
    pathogen.position.set(1.9, 3.8, 0.9);
    group.add(pathogen);
  } else if (biome === 'food_chain' || biome === 'biomes' || biome === 'botanical') {
    // Towering Rainforest Buttress Tree + Trophic Pyramid Blocks
    const trunk = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 3.6, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }),
    );
    trunk.position.y = 2.4;
    trunk.castShadow = true;
    group.add(trunk);

    // Buttress roots
    for (let i = 0; i < 4; i++) {
      const rootFin = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 1.2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.88 }),
      );
      const a = (i * Math.PI) / 2;
      rootFin.position.set(Math.cos(a) * 0.7, 1.2, Math.sin(a) * 0.7);
      rootFin.rotation.y = a;
      group.add(rootFin);
    }

    const crown1 = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.2, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }),
    );
    crown1.position.y = 4.2;
    crown1.castShadow = true;
    group.add(crown1);

    const crown2 = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.0, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65 }),
    );
    crown2.position.y = 5.2;
    group.add(crown2);

    const blossom = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      new THREE.MeshStandardMaterial({
        color: biome === 'botanical' ? 0xec4899 : 0xfacc15,
        emissive: biome === 'botanical' ? 0xdb2777 : 0xeab308,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      }),
    );
    blossom.position.set(0, 6.0, 0);
    group.add(blossom);
  } else {
    // Science Tower / Lab Pillar Monument (Climate, Inquiry, Circuit, Forge, Matter, Light, Friction)
    const accentColors: Record<string, number> = {
      climate_ice: 0x38bdf8,
      inquiry_lab: 0x0ea5e9,
      circuit_grid: 0xfacc15,
      forge_metals: 0xf97316,
      matter_camp: 0xef4444,
      light_prism: 0xc084fc,
      friction_track: 0x14b8a6,
    };
    const accent = accentColors[biome] ?? 0x38bdf8;

    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.9, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.65, metalness: 0.2 }),
    );
    pillar.position.y = 2.15;
    pillar.castShadow = true;
    group.add(pillar);

    const ring = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.4, 2.6),
      new THREE.MeshStandardMaterial({ color: accent, metalness: 0.55, roughness: 0.25 }),
    );
    ring.position.y = 3.2;
    group.add(ring);

    const crown = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.05, 0),
      new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.4,
      }),
    );
    crown.position.y = 4.65;
    group.add(crown);
  }

  return group;
}

/**
 * Builds a welcoming composite Minecraft-style My World Workshop Arch landmark
 * placed outside the north perimeter of the 17x17 buildable plaza.
 */
export function buildMyWorldArchMonument(): THREE.Group {
  const group = new THREE.Group();

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
    metalness: 0.1,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.78,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xd97706,
    emissiveIntensity: 0.35,
    roughness: 0.25,
    metalness: 0.72,
  });
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.35,
  });

  // Left & Right Pillars + Bases
  [-2.6, 2.6].forEach((px) => {
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.4), stoneMat);
    base.position.set(px, 0.25, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.2, 0.9), woodMat);
    pillar.position.set(px, 2.1, 0);
    pillar.castShadow = true;
    group.add(pillar);

    const torch = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), goldMat);
    torch.position.set(px, 3.9, 0);
    group.add(torch);
  });

  // Overhead Crossbeam Lintel
  const beam = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.75, 1.15), stoneMat);
  beam.position.set(0, 3.65, 0);
  beam.castShadow = true;
  group.add(beam);

  // Center Trophy Crystal & Trim
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 1.3), goldMat);
  plaque.position.set(0, 3.65, 0);
  group.add(plaque);

  const crest = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 0), crystalMat);
  crest.position.set(0, 4.75, 0);
  group.add(crest);

  return group;
}

export interface TopicHabitatAnimPart {
  mesh: THREE.Object3D;
  mode: 'hop' | 'spin' | 'orbit' | 'sway' | 'bob' | 'waddle';
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
}

export interface TopicHabitatResult {
  root: THREE.Group;
  animatedParts: TopicHabitatAnimPart[];
}

function makeVoxelBox(
  w: number,
  h: number,
  d: number,
  color: number,
  x: number,
  y: number,
  z: number,
  opts?: { emissive?: number; emissiveIntensity?: number; transparent?: boolean; opacity?: number; metalness?: number; roughness?: number },
): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts?.roughness ?? 0.72,
    metalness: opts?.metalness ?? 0.08,
    emissive: opts?.emissive ?? 0x000000,
    emissiveIntensity: opts?.emissiveIntensity ?? 0,
    transparent: opts?.transparent ?? false,
    opacity: opts?.opacity ?? 1,
    depthWrite: opts?.transparent ? false : true,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = !opts?.transparent;
  mesh.receiveShadow = true;
  return mesh;
}

function buildVoxelAnimal(kind: 'penguin' | 'polar_bear' | 'frog' | 'rabbit' | 'fox' | 'chick' | 'tortoise'): THREE.Group {
  const g = new THREE.Group();
  if (kind === 'penguin') {
    g.add(makeVoxelBox(0.42, 0.56, 0.36, 0x0f172a, 0, 0.34, 0));
    g.add(makeVoxelBox(0.32, 0.42, 0.08, 0xf8fafc, 0, 0.3, 0.16));
    g.add(makeVoxelBox(0.16, 0.09, 0.14, 0xf97316, 0, 0.44, 0.22));
    g.add(makeVoxelBox(0.12, 0.07, 0.18, 0xf97316, -0.11, 0.04, 0.05));
    g.add(makeVoxelBox(0.12, 0.07, 0.18, 0xf97316, 0.11, 0.04, 0.05));
  } else if (kind === 'polar_bear') {
    g.add(makeVoxelBox(0.56, 0.42, 0.78, 0xf8fafc, 0, 0.36, 0));
    g.add(makeVoxelBox(0.42, 0.36, 0.4, 0xf8fafc, 0, 0.52, 0.42));
    g.add(makeVoxelBox(0.12, 0.12, 0.08, 0xe2e8f0, -0.14, 0.72, 0.34));
    g.add(makeVoxelBox(0.12, 0.12, 0.08, 0xe2e8f0, 0.14, 0.72, 0.34));
    g.add(makeVoxelBox(0.12, 0.1, 0.1, 0x0f172a, 0, 0.47, 0.64));
    for (const [lx, lz] of [[-0.18, -0.24], [0.18, -0.24], [-0.18, 0.24], [0.18, 0.24]]) {
      g.add(makeVoxelBox(0.15, 0.2, 0.15, 0xe2e8f0, lx, 0.1, lz));
    }
  } else if (kind === 'frog') {
    g.add(makeVoxelBox(0.44, 0.24, 0.48, 0x22c55e, 0, 0.18, 0));
    g.add(makeVoxelBox(0.36, 0.1, 0.38, 0xbef264, 0, 0.11, 0.02));
    g.add(makeVoxelBox(0.12, 0.12, 0.12, 0xfef08a, -0.13, 0.34, 0.16));
    g.add(makeVoxelBox(0.12, 0.12, 0.12, 0xfef08a, 0.13, 0.34, 0.16));
    g.add(makeVoxelBox(0.14, 0.14, 0.22, 0x16a34a, -0.24, 0.08, -0.12));
    g.add(makeVoxelBox(0.14, 0.14, 0.22, 0x16a34a, 0.24, 0.08, -0.12));
  } else if (kind === 'rabbit') {
    g.add(makeVoxelBox(0.36, 0.34, 0.48, 0xfef3c7, 0, 0.22, 0));
    g.add(makeVoxelBox(0.3, 0.28, 0.3, 0xfef3c7, 0, 0.42, 0.2));
    g.add(makeVoxelBox(0.09, 0.28, 0.09, 0xfde68a, -0.09, 0.68, 0.16));
    g.add(makeVoxelBox(0.09, 0.28, 0.09, 0xfde68a, 0.09, 0.68, 0.16));
    g.add(makeVoxelBox(0.1, 0.1, 0.1, 0xffffff, 0, 0.22, -0.27));
  } else if (kind === 'fox') {
    g.add(makeVoxelBox(0.44, 0.36, 0.72, 0xea580c, 0, 0.34, 0));
    g.add(makeVoxelBox(0.36, 0.32, 0.38, 0xea580c, 0, 0.5, 0.4));
    g.add(makeVoxelBox(0.18, 0.14, 0.22, 0xf8fafc, 0, 0.41, 0.62));
    g.add(makeVoxelBox(0.12, 0.14, 0.08, 0x7c2d12, -0.12, 0.7, 0.32));
    g.add(makeVoxelBox(0.12, 0.14, 0.08, 0x7c2d12, 0.12, 0.7, 0.32));
    g.add(makeVoxelBox(0.18, 0.2, 0.45, 0xf97316, 0, 0.38, -0.52));
    g.add(makeVoxelBox(0.16, 0.18, 0.16, 0xffffff, 0, 0.38, -0.76));
  } else if (kind === 'chick') {
    g.add(makeVoxelBox(0.3, 0.32, 0.32, 0xfacc15, 0, 0.22, 0));
    g.add(makeVoxelBox(0.24, 0.22, 0.24, 0xfef08a, 0, 0.45, 0.08));
    g.add(makeVoxelBox(0.1, 0.08, 0.12, 0xf97316, 0, 0.42, 0.22));
  } else {
    // Tortoise
    g.add(makeVoxelBox(0.54, 0.26, 0.62, 0x3f6212, 0, 0.22, 0));
    g.add(makeVoxelBox(0.42, 0.14, 0.48, 0x65a30d, 0, 0.36, 0));
    g.add(makeVoxelBox(0.22, 0.2, 0.24, 0x84cc16, 0, 0.22, 0.38));
    for (const [lx, lz] of [[-0.22, -0.2], [0.22, -0.2], [-0.22, 0.2], [0.22, 0.2]]) {
      g.add(makeVoxelBox(0.12, 0.14, 0.12, 0x4d7c0f, lx, 0.07, lz));
    }
  }
  return g;
}

/**
 * Builds an unmistakable multi-level 3D terrain terrace + topic-related living things
 * and science props for each completed P4 Science Topic in My World!
 */
export function buildTopicHabitatZone(stage: TopicStage): TopicHabitatResult {
  const root = new THREE.Group();
  const animatedParts: TopicHabitatAnimPart[] = [];
  const id = stage.id;

  // Stepped terrain pad colors tuned per topic biome
  const terrainColors: Record<number, { base: number; step: number; accent: number }> = {
    1: { base: 0x78350f, step: 0x57534e, accent: 0xea580c },
    2: { base: 0xd97706, step: 0xfde68a, accent: 0xf59e0b },
    3: { base: 0xe0f2fe, step: 0x38bdf8, accent: 0xbae6fd },
    4: { base: 0x22c55e, step: 0x0ea5e9, accent: 0xfacc15 },
    5: { base: 0x16a34a, step: 0x15803d, accent: 0x84cc16 },
    6: { base: 0x4ade80, step: 0xec4899, accent: 0xfacc15 },
    7: { base: 0x0f766e, step: 0x2dd4bf, accent: 0x8b5cf6 },
    8: { base: 0x78350f, step: 0x0284c7, accent: 0x22c55e },
    9: { base: 0x475569, step: 0xb45309, accent: 0xfacc15 },
    10: { base: 0x7c2d12, step: 0x64748b, accent: 0xd97706 },
    11: { base: 0x57534e, step: 0x92400e, accent: 0xf97316 },
    12: { base: 0x312e81, step: 0xc4b5fd, accent: 0x38bdf8 },
    13: { base: 0x1e293b, step: 0x93c5fd, accent: 0x14b8a6 },
    14: { base: 0x0f172a, step: 0x334155, accent: 0x38bdf8 },
  };
  const pal = terrainColors[id] ?? { base: 0x475569, step: 0x22c55e, accent: 0xf59e0b };

  // Base 4.0x4.0 biome terrain terrace
  root.add(makeVoxelBox(4.0, 0.24, 4.0, pal.base, 0, 0.12, 0));

  if (id === 1) {
    // Topic 1: Towering Stepped Volcanic Mountain with Glowing Lava Crater & Flowing Lava Stream + Ferns & Earthworm
    // Mountain tiers shifted slightly back-left so the front-right lava cascade & living soil face the camera
    root.add(makeVoxelBox(3.1, 0.75, 3.1, 0x57534e, -0.3, 0.62, -0.3));
    root.add(makeVoxelBox(2.4, 0.85, 2.4, 0x44403c, -0.35, 1.42, -0.35));
    root.add(makeVoxelBox(1.7, 0.85, 1.7, 0x78716c, -0.4, 2.27, -0.4));
    root.add(makeVoxelBox(1.18, 0.75, 1.18, 0x292524, -0.4, 3.07, -0.4));

    // Glowing molten lava crater rim & core at the summit (y ~ 3.5)
    root.add(
      makeVoxelBox(0.84, 0.35, 0.84, 0xf97316, -0.4, 3.55, -0.4, {
        emissive: 0xea580c,
        emissiveIntensity: 1.25,
        roughness: 0.25,
      }),
    );
    root.add(
      makeVoxelBox(0.42, 0.28, 0.42, 0xfef08a, -0.4, 3.74, -0.4, {
        emissive: 0xfacc15,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      }),
    );

    // Cascading glowing lava stream flowing down the front (+X, +Z) slope into a magma pool
    const lavaSteps: [number, number, number, number, number, number][] = [
      [-0.02, 3.18, 0.05, 0.42, 0.55, 0.42],
      [0.24, 2.35, 0.26, 0.44, 0.9, 0.44],
      [0.48, 1.48, 0.48, 0.48, 0.9, 0.48],
      [0.68, 0.72, 0.68, 0.54, 0.75, 0.54],
      [0.86, 0.3, 0.88, 1.1, 0.16, 1.05], // glowing lava pool at mountain foot
    ];
    lavaSteps.forEach(([lx, ly, lz, w, h, d], idx) => {
      root.add(
        makeVoxelBox(w, h, d, idx % 2 === 0 ? 0xf97316 : 0xfb923c, lx, ly, lz, {
          emissive: 0xea580c,
          emissiveIntensity: 1.15,
          roughness: 0.22,
        }),
      );
    });

    // Animated rising volcanic lava embers above the crater
    for (let i = 0; i < 2; i++) {
      const ember = makeVoxelBox(0.22, 0.22, 0.22, 0xfef08a, -0.4 + i * 0.24, 4.15 + i * 0.3, -0.38, {
        emissive: 0xf97316,
        emissiveIntensity: 1.35,
      });
      root.add(ember);
      animatedParts.push({
        mesh: ember,
        mode: 'bob',
        baseX: -0.4 + i * 0.24,
        baseY: 4.15 + i * 0.3,
        baseZ: -0.38,
        phase: i * 1.4,
      });
    }

    // Soil Ferns & Earthworm at the fertile terrace edge
    for (const [fx, fz, ph] of [[1.35, -0.7, 0], [-1.35, 1.25, 1.4]] as [number, number, number][]) {
      const fern = new THREE.Group();
      fern.position.set(fx, 0.24, fz);
      fern.add(makeVoxelBox(0.14, 0.52, 0.14, 0x15803d, 0, 0.26, 0));
      fern.add(makeVoxelBox(0.58, 0.12, 0.2, 0x22c55e, 0, 0.48, 0));
      fern.add(makeVoxelBox(0.2, 0.12, 0.58, 0x4ade80, 0, 0.52, 0));
      root.add(fern);
      animatedParts.push({ mesh: fern, mode: 'sway', baseX: fx, baseY: 0.24, baseZ: fz, phase: ph });
    }
    const worm = new THREE.Group();
    worm.position.set(-0.35, 0.34, 1.45);
    for (let i = 0; i < 4; i++) {
      worm.add(makeVoxelBox(0.2, 0.18, 0.2, i % 2 === 0 ? 0xfb7185 : 0xf43f5e, i * 0.18 - 0.25, i % 2 === 0 ? 0 : 0.06, 0));
    }
    root.add(worm);
    animatedParts.push({ mesh: worm, mode: 'bob', baseX: -0.35, baseY: 0.34, baseZ: 1.45, phase: 0.5 });
  } else {
    // Stepped elevation hill at back corner for Topics 2-14
    root.add(makeVoxelBox(1.9, 0.48, 1.6, pal.step, -0.7, 0.48, -0.8));
    root.add(makeVoxelBox(1.15, 0.45, 1.05, pal.accent, -0.85, 0.92, -0.9));
  }

  if (id === 1) {
    // Handled above with full Volcanic Mountain with Lava
  } else if (id === 2) {
    // Topic 2: Sunflowers + Spinning Tilted Earth Globe & Sun
    for (const [sx, sz, ph] of [[-0.9, 0.8, 0], [0.95, 0.75, 1.2]] as [number, number, number][]) {
      const flower = new THREE.Group();
      flower.position.set(sx, 0.24, sz);
      flower.add(makeVoxelBox(0.14, 0.95, 0.14, 0x16a34a, 0, 0.48, 0));
      flower.add(makeVoxelBox(0.52, 0.52, 0.16, 0xfacc15, 0, 1.0, 0));
      flower.add(makeVoxelBox(0.26, 0.26, 0.2, 0x78350f, 0, 1.0, 0.04));
      root.add(flower);
      animatedParts.push({ mesh: flower, mode: 'sway', baseX: sx, baseY: 0.24, baseZ: sz, phase: ph });
    }
    const globe = new THREE.Group();
    globe.position.set(0.3, 1.25, -0.1);
    globe.add(makeVoxelBox(0.85, 0.85, 0.85, 0x2563eb, 0, 0, 0));
    globe.add(makeVoxelBox(0.52, 0.35, 0.92, 0x22c55e, 0.1, 0.12, 0));
    globe.rotation.z = THREE.MathUtils.degToRad(23.5);
    root.add(globe);
    animatedParts.push({ mesh: globe, mode: 'spin', baseX: 0.3, baseY: 1.25, baseZ: -0.1, phase: 0 });
  } else if (id === 3) {
    // Topic 3: Arctic Glacier Iceberg + Waddling Penguin + Polar Bear Cub
    root.add(
      makeVoxelBox(1.2, 1.15, 1.1, 0x7dd3fc, -0.7, 0.85, -0.7, {
        transparent: true,
        opacity: 0.82,
      }),
    );
    const penguin = buildVoxelAnimal('penguin');
    penguin.position.set(0.75, 0.24, 0.65);
    root.add(penguin);
    animatedParts.push({ mesh: penguin, mode: 'waddle', baseX: 0.75, baseY: 0.24, baseZ: 0.65, phase: 0 });

    const bear = buildVoxelAnimal('polar_bear');
    bear.scale.setScalar(0.85);
    bear.position.set(-0.35, 0.24, 0.75);
    root.add(bear);
    animatedParts.push({ mesh: bear, mode: 'bob', baseX: -0.35, baseY: 0.24, baseZ: 0.75, phase: 1.1 });
  } else if (id === 4) {
    // Topic 4: Wetland Water Pond + Hopping Frog + Desert Sand Cactus
    root.add(makeVoxelBox(1.75, 0.1, 1.65, 0x0ea5e9, 0.55, 0.26, 0.45));
    const lily = makeVoxelBox(0.65, 0.08, 0.65, 0x16a34a, 0.55, 0.33, 0.45);
    root.add(lily);
    const frog = buildVoxelAnimal('frog');
    frog.position.set(0.55, 0.36, 0.45);
    root.add(frog);
    animatedParts.push({ mesh: frog, mode: 'hop', baseX: 0.55, baseY: 0.36, baseZ: 0.45, phase: 0.3 });

    // Sand patch & Cactus
    root.add(makeVoxelBox(1.3, 0.16, 1.3, 0xfde68a, -0.85, 0.3, 0.75));
    root.add(makeVoxelBox(0.36, 1.25, 0.36, 0x15803d, -0.85, 0.96, 0.75));
    root.add(makeVoxelBox(0.35, 0.2, 0.22, 0x16a34a, -1.12, 1.05, 0.75));
    root.add(makeVoxelBox(0.22, 0.42, 0.22, 0x16a34a, -1.2, 1.26, 0.75));
  } else if (id === 5) {
    // Topic 5: Food Chain Grove — Rabbit, Red Fox & Fluttering Butterfly
    const rabbit = buildVoxelAnimal('rabbit');
    rabbit.position.set(0.75, 0.24, 0.8);
    root.add(rabbit);
    animatedParts.push({ mesh: rabbit, mode: 'hop', baseX: 0.75, baseY: 0.24, baseZ: 0.8, phase: 0 });

    const fox = buildVoxelAnimal('fox');
    fox.scale.setScalar(0.85);
    fox.position.set(-0.55, 0.24, 0.6);
    root.add(fox);
    animatedParts.push({ mesh: fox, mode: 'waddle', baseX: -0.55, baseY: 0.24, baseZ: 0.6, phase: 1.5 });

    const butterfly = new THREE.Group();
    butterfly.position.set(0.3, 1.45, 0);
    butterfly.add(makeVoxelBox(0.1, 0.1, 0.28, 0x0f172a, 0, 0, 0));
    butterfly.add(makeVoxelBox(0.32, 0.06, 0.28, 0xfacc15, -0.18, 0.04, 0));
    butterfly.add(makeVoxelBox(0.32, 0.06, 0.28, 0xfacc15, 0.18, 0.04, 0));
    root.add(butterfly);
    animatedParts.push({ mesh: butterfly, mode: 'orbit', baseX: 0.3, baseY: 1.45, baseZ: 0, phase: 0.7 });
  } else if (id === 6) {
    // Topic 6: Pollination Garden — Flowers, Buzzing Bees & Nesting Chick
    for (const [fx, fz, col] of [[-0.85, 0.8, 0xec4899], [0.85, 0.7, 0xfacc15], [0.9, -0.65, 0xa855f7]] as [number, number, number][]) {
      root.add(makeVoxelBox(0.12, 0.55, 0.12, 0x16a34a, fx, 0.52, fz));
      root.add(makeVoxelBox(0.42, 0.22, 0.42, col, fx, 0.86, fz));
    }
    const chick = buildVoxelAnimal('chick');
    chick.position.set(0.05, 0.24, 0.8);
    root.add(chick);
    animatedParts.push({ mesh: chick, mode: 'hop', baseX: 0.05, baseY: 0.24, baseZ: 0.8, phase: 0.4 });

    const bee = new THREE.Group();
    bee.position.set(0, 1.35, 0.1);
    bee.add(makeVoxelBox(0.24, 0.2, 0.34, 0xfacc15, 0, 0, 0));
    bee.add(makeVoxelBox(0.26, 0.22, 0.1, 0x0f172a, 0, 0, 0));
    bee.add(makeVoxelBox(0.36, 0.05, 0.18, 0xe0f2fe, 0, 0.14, 0));
    root.add(bee);
    animatedParts.push({ mesh: bee, mode: 'orbit', baseX: 0, baseY: 1.35, baseZ: 0.1, phase: 0 });
  } else if (id === 7) {
    // Topic 7: Bio-Lab Living Cell + Immune Defender + Microbe
    const cell = new THREE.Group();
    cell.position.set(0.25, 1.25, 0);
    cell.add(
      makeVoxelBox(1.3, 1.15, 1.3, 0x2dd4bf, 0, 0, 0, {
        transparent: true,
        opacity: 0.48,
      }),
    );
    cell.add(
      makeVoxelBox(0.55, 0.55, 0.55, 0x8b5cf6, 0, 0, 0, {
        emissive: 0x6d28d9,
        emissiveIntensity: 0.65,
      }),
    );
    cell.add(makeVoxelBox(0.24, 0.18, 0.18, 0xf97316, 0.36, -0.2, 0.25));
    root.add(cell);
    animatedParts.push({ mesh: cell, mode: 'bob', baseX: 0.25, baseY: 1.25, baseZ: 0, phase: 0 });

    const wbc = new THREE.Group();
    wbc.position.set(-0.75, 0.55, 0.85);
    wbc.add(makeVoxelBox(0.55, 0.55, 0.55, 0xf8fafc, 0, 0, 0));
    wbc.add(makeVoxelBox(0.25, 0.25, 0.25, 0x38bdf8, 0, 0.15, 0.22));
    root.add(wbc);
    animatedParts.push({ mesh: wbc, mode: 'orbit', baseX: 0.2, baseY: 0.6, baseZ: 0.2, phase: 2.1 });
  } else if (id === 8) {
    // Topic 8: Fair-Test Seedling Pots (3 growth stages) + Magnifying Lens
    [[-0.85, 0.35], [0, 0.62], [0.85, 0.92]].forEach(([px, stemH], idx) => {
      root.add(makeVoxelBox(0.5, 0.35, 0.5, 0xb45309, px, 0.42, 0.7));
      const sprout = new THREE.Group();
      sprout.position.set(px, 0.6, 0.7);
      sprout.add(makeVoxelBox(0.1, stemH, 0.1, 0x16a34a, 0, stemH / 2, 0));
      sprout.add(makeVoxelBox(0.36, 0.1, 0.18, 0x4ade80, 0, stemH, 0));
      root.add(sprout);
      animatedParts.push({ mesh: sprout, mode: 'sway', baseX: px, baseY: 0.6, baseZ: 0.7, phase: idx * 0.8 });
    });
  } else if (id === 9) {
    // Topic 9: Spinning Wind Turbine + Solar Panel + Glowing Bulb
    root.add(makeVoxelBox(0.24, 2.0, 0.24, 0xf8fafc, 0.6, 1.24, -0.35));
    const rotor = new THREE.Group();
    rotor.position.set(0.6, 2.15, -0.15);
    rotor.add(makeVoxelBox(1.5, 0.16, 0.08, 0xe2e8f0, 0, 0, 0));
    rotor.add(makeVoxelBox(0.16, 1.5, 0.08, 0xe2e8f0, 0, 0, 0));
    root.add(rotor);
    animatedParts.push({ mesh: rotor, mode: 'spin', baseX: 0.6, baseY: 2.15, baseZ: -0.15, phase: 0 });

    // Solar panel & glowing lamp
    const solar = makeVoxelBox(1.1, 0.12, 0.85, 0x1d4ed8, -0.7, 0.6, 0.75, { metalness: 0.65 });
    solar.rotation.x = 0.4;
    root.add(solar);
    root.add(
      makeVoxelBox(0.36, 0.42, 0.36, 0xfef08a, 0.85, 0.65, 0.8, {
        emissive: 0xfacc15,
        emissiveIntensity: 1.2,
      }),
    );
  } else if (id === 10) {
    // Topic 10: Workshop Robot Buddy + Copper Coil & Anvil
    const bot = new THREE.Group();
    bot.position.set(0.65, 0.24, 0.65);
    bot.add(makeVoxelBox(0.54, 0.65, 0.44, 0x94a3b8, 0, 0.42, 0, { metalness: 0.65 }));
    bot.add(makeVoxelBox(0.46, 0.42, 0.42, 0xd97706, 0, 0.95, 0, { metalness: 0.7 }));
    bot.add(makeVoxelBox(0.32, 0.12, 0.08, 0x38bdf8, 0, 0.96, 0.22, { emissive: 0x0ea5e9, emissiveIntensity: 1 }));
    bot.add(makeVoxelBox(0.08, 0.28, 0.08, 0xfacc15, 0, 1.28, 0));
    root.add(bot);
    animatedParts.push({ mesh: bot, mode: 'bob', baseX: 0.65, baseY: 0.24, baseZ: 0.65, phase: 0.3 });
    root.add(makeVoxelBox(0.85, 0.42, 0.5, 0x334155, -0.7, 0.45, 0.75, { metalness: 0.75 }));
  } else if (id === 11) {
    // Topic 11: Crackling Campfire + Rising Steam Kettle
    root.add(makeVoxelBox(0.9, 0.18, 0.22, 0x78350f, 0.3, 0.33, 0.55));
    root.add(makeVoxelBox(0.22, 0.18, 0.9, 0x78350f, 0.3, 0.33, 0.55));
    const flame = new THREE.Group();
    flame.position.set(0.3, 0.55, 0.55);
    flame.add(makeVoxelBox(0.42, 0.52, 0.42, 0xf97316, 0, 0, 0, { emissive: 0xea580c, emissiveIntensity: 1.1 }));
    flame.add(makeVoxelBox(0.24, 0.38, 0.24, 0xfef08a, 0, 0.18, 0, { emissive: 0xfacc15, emissiveIntensity: 1.2 }));
    root.add(flame);
    animatedParts.push({ mesh: flame, mode: 'bob', baseX: 0.3, baseY: 0.55, baseZ: 0.55, phase: 0 });
    const puff = makeVoxelBox(0.32, 0.28, 0.32, 0xf8fafc, -0.65, 1.35, 0.55, { transparent: true, opacity: 0.7 });
    root.add(puff);
    animatedParts.push({ mesh: puff, mode: 'bob', baseX: -0.65, baseY: 1.35, baseZ: 0.55, phase: 1.3 });
  } else if (id === 12) {
    // Topic 12: Crystal Prism + Rainbow Light Beams + Mirror
    const prism = makeVoxelBox(0.68, 0.9, 0.68, 0xe0f2fe, 0.2, 0.95, 0.2, {
      transparent: true,
      opacity: 0.75,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.45,
    });
    root.add(prism);
    animatedParts.push({ mesh: prism, mode: 'spin', baseX: 0.2, baseY: 0.95, baseZ: 0.2, phase: 0 });
    [0xef4444, 0xfacc15, 0x22c55e, 0x38bdf8].forEach((c, idx) => {
      root.add(makeVoxelBox(1.1, 0.1, 0.1, c, 0.85, 0.7 + idx * 0.14, 0.55, { emissive: c, emissiveIntensity: 0.8 }));
    });
  } else if (id === 13) {
    // Topic 13: Ice vs Gravel Track + Racing Tortoise & Cart
    root.add(makeVoxelBox(2.4, 0.1, 0.7, 0xbae6fd, 0.2, 0.28, 0.8));
    const tortoise = buildVoxelAnimal('tortoise');
    tortoise.position.set(-0.55, 0.34, 0.8);
    root.add(tortoise);
    animatedParts.push({ mesh: tortoise, mode: 'waddle', baseX: -0.55, baseY: 0.34, baseZ: 0.8, phase: 0.2 });

    const cart = new THREE.Group();
    cart.position.set(0.75, 0.38, 0.78);
    cart.add(makeVoxelBox(0.65, 0.26, 0.44, 0x14b8a6, 0, 0.16, 0));
    cart.add(makeVoxelBox(0.18, 0.18, 0.52, 0x0f172a, -0.2, 0.05, 0));
    cart.add(makeVoxelBox(0.18, 0.18, 0.52, 0x0f172a, 0.2, 0.05, 0));
    root.add(cart);
    animatedParts.push({ mesh: cart, mode: 'bob', baseX: 0.75, baseY: 0.38, baseZ: 0.78, phase: 0.9 });
  } else {
    // Topic 14: Space Rocket + Orbiting Satellite + Mars Rover
    const rocket = new THREE.Group();
    rocket.position.set(0.35, 0.3, -0.1);
    rocket.add(makeVoxelBox(0.58, 1.45, 0.58, 0xf8fafc, 0, 0.85, 0));
    rocket.add(makeVoxelBox(0.38, 0.45, 0.38, 0xef4444, 0, 1.8, 0));
    rocket.add(makeVoxelBox(0.24, 0.35, 0.24, 0x38bdf8, 0, 1.1, 0.22, { emissive: 0x0ea5e9, emissiveIntensity: 0.8 }));
    rocket.add(makeVoxelBox(0.95, 0.4, 0.22, 0xef4444, 0, 0.3, 0));
    root.add(rocket);
    animatedParts.push({ mesh: rocket, mode: 'bob', baseX: 0.35, baseY: 0.3, baseZ: -0.1, phase: 0 });

    const sat = new THREE.Group();
    sat.position.set(0.3, 2.25, 0);
    sat.add(makeVoxelBox(0.3, 0.28, 0.34, 0xe2e8f0, 0, 0, 0, { metalness: 0.8 }));
    sat.add(makeVoxelBox(0.95, 0.06, 0.28, 0x1d4ed8, 0, 0, 0));
    root.add(sat);
    animatedParts.push({ mesh: sat, mode: 'orbit', baseX: 0.3, baseY: 2.25, baseZ: 0, phase: 0 });

    // Mars Rover
    const rover = new THREE.Group();
    rover.position.set(-0.7, 0.24, 0.85);
    rover.add(makeVoxelBox(0.52, 0.22, 0.6, 0xfef3c7, 0, 0.2, 0));
    rover.add(makeVoxelBox(0.18, 0.18, 0.68, 0x334155, -0.25, 0.09, 0));
    rover.add(makeVoxelBox(0.18, 0.18, 0.68, 0x334155, 0.25, 0.09, 0));
    root.add(rover);
  }

  return { root, animatedParts };
}
