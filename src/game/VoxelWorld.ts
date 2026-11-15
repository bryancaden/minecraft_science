import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type {
  CameraViewMode,
  GamePhase,
  HeroCharacter,
  MyWorldTool,
  PlacedVoxelBlock,
  TopicStage,
} from '../types/game';
import {
  BIOME_PALETTES,
  createContactShadowTexture,
  createVoxelBumpTexture,
  createVoxelTileTexture,
} from './textures';
import {
  buildMatchBoyModel,
  buildMyWorldArchMonument,
  buildQuestBeacon,
  buildResourcePickup,
  buildSparkyCompanion,
  buildTopicHabitatZone,
  buildTopicLandmark,
  buildVoxelTree,
  type AnimatedActorRefs,
  type BeaconRefs,
  type SparkyRefs,
  type TopicHabitatAnimPart,
} from './models';
import { clampPlayerPosition, findNearestActiveBeacon } from './rules';
import {
  blockKey,
  computeFirstPersonCameraPose,
  computeFirstPersonMoveVector,
  computeMyWorldLayout,
  doesBlockOverlapActor,
  getBlockFinishStyle,
  getGroundTopY,
  getMyWorldSupportHeight,
  groundColKey,
  isValidBlockCoord,
  MAX_DIG_DEPTH,
  MY_WORLD_BOUNDS,
  resolveMyWorldHorizontalCollision,
  type MyWorldBounds,
  type MyWorldLayout,
  type SolidBoxCollider,
} from './myWorld';
import { soundFX } from './audio';
import {
  computeParticleLifeScale,
  createVoxelParticlePool,
  emitConfettiExplosion,
  emitVoxelBurst,
  parseHexColor,
  resetVoxelParticlePool,
  stepVoxelParticles,
  type VoxelParticlePool,
} from './particles';
import {
  DEFAULT_START_MINUTES,
  IN_GAME_MINUTES_PER_REAL_SECOND,
  createRainPool,
  getWeatherForInGameTime,
  normalizeInGameMinutes,
  stepRainPool,
  type RainPool,
  type WeatherDisplayState,
} from './weather';

export interface VoxelWorldCallbacks {
  onNearbyBeaconChange: (beaconIndex: number | null) => void;
  onInteractBeacon: (beaconIndex: number) => void;
  onCollectPickup: () => void;
  onSwitchHero: () => void;
  onTimerTick: (secondsLeft: number) => void;
  onTimeExpired: () => void;
  onTogglePause: () => void;
  onWeatherChange?: (weather: WeatherDisplayState) => void;
  onPlaceMyWorldBlock?: (x: number, y: number, z: number) => void;
  onRemoveMyWorldBlock?: (x: number, y: number, z: number) => void;
  onDigMyWorldCell?: (x: number, z: number, targetBlockY?: number) => void;
  onSelectHotbarIndex?: (index: number) => void;
  onToggleMyWorldTool?: () => void;
  onToggleCameraView?: () => void;
}

interface PickupItem {
  mesh: THREE.Group;
  shadow: THREE.Mesh;
  x: number;
  z: number;
  collected: boolean;
  phaseOffset: number;
}

const ARENA_HALF_EXTENT = 10.2;
const BEACON_COORDS: [number, number][] = [
  [-5.5, 0.5],
  [0, -4.2],
  [5.5, 0.5],
];
const PARTICLE_POOL_SIZE = 260;
const RAIN_POOL_SIZE = 180;

// Pre-allocated scratch math helpers (zero GC inside animation loop)
const _dummy = new THREE.Object3D();
const _vec3 = new THREE.Vector3();
const _camGoal = new THREE.Vector3();
const _lookGoal = new THREE.Vector3();
const _color = new THREE.Color();
const _skyScratch = new THREE.Color();
const _fogScratch = new THREE.Color();
const _cloudSunnyColor = new THREE.Color(0xffffff);
const _cloudRainColor = new THREE.Color(0x64748b);
const _rainSkyColor = new THREE.Color(0x475569);
const _rainFogColor = new THREE.Color(0x64748b);
const _goldenSkyColor = new THREE.Color(0xfdba74);
const _keySunnyColor = new THREE.Color(0xfff1d6);
const _keyGoldenColor = new THREE.Color(0xfde68a);
const _keyRainColor = new THREE.Color(0xcbd5e1);
const _hemiSunnyColor = new THREE.Color(0xa5d8ff);
const _hemiRainColor = new THREE.Color(0x94a3b8);

export class VoxelWorldController {
  private container: HTMLElement;
  private callbacks: VoxelWorldCallbacks;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean;
  private maxAnisotropy: number;

  private keyLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private stageGroup: THREE.Group;
  private myWorldGroup: THREE.Group;
  private dynamicGroup: THREE.Group;

  private bryan: AnimatedActorRefs;
  private caden: AnimatedActorRefs;
  private sparky: SparkyRefs;
  private bryanShadow: THREE.Mesh;
  private cadenShadow: THREE.Mesh;
  private shadowTex: THREE.CanvasTexture;

  private beacons: BeaconRefs[] = [];
  private beaconHitMeshes: THREE.Mesh[] = [];
  private beaconCompleted: boolean[] = [false, false, false];
  private pickups: PickupItem[] = [];

  private myWorldBlockGeo: THREE.BoxGeometry;
  private myWorldCapGeo: THREE.BoxGeometry;
  private myWorldEdgeGeo: THREE.EdgesGeometry;
  private myWorldEdgeMat: THREE.LineBasicMaterial;
  private myWorldPreviewMesh: THREE.Mesh;
  private myWorldPreviewMat: THREE.MeshBasicMaterial;
  private myWorldBlockMeshes: THREE.Mesh[] = [];
  private myWorldOccupiedKeys = new Set<string>();
  private myWorldMatCache = new Map<
    string,
    {
      main: THREE.MeshStandardMaterial;
      accent: THREE.MeshStandardMaterial;
      tex: THREE.CanvasTexture;
    }
  >();
  private myWorldResourceSpecs = new Map<string, TopicStage['rewardResource']>();
  private myWorldPlacedBlocks: PlacedVoxelBlock[] = [];
  private myWorldTerrainGroup: THREE.Group;
  private myWorldTerrainMeshes: THREE.InstancedMesh[] = [];
  private myWorldTerrainCoords = new Map<THREE.Object3D, { x: number; z: number; topY: number }[]>();
  private myWorldDugDepths: Record<string, number> = {};
  private myWorldTerrainMats: {
    plaza: THREE.MeshStandardMaterial;
    subsoil: THREE.MeshStandardMaterial;
    bedrock: THREE.MeshStandardMaterial;
    textures: THREE.CanvasTexture[];
  } | null = null;
  private myWorldExtraColliders: SolidBoxCollider[] = [];
  private myWorldFloatingProps: TopicHabitatAnimPart[] = [];
  private myWorldBounds: MyWorldBounds = MY_WORLD_BOUNDS;
  private myWorldIslandRadius = 11;
  private myWorldTool: MyWorldTool = 'build';
  private myWorldSelectedHasStock = true;
  private myWorldCameraYaw = 0;
  private myWorldCameraYawTarget = 0;
  private cameraViewMode: CameraViewMode = 'third_person';
  private firstPersonPitch = -0.12;
  private pointerDragState: {
    active: boolean;
    lastX: number;
    lastY: number;
    moved: number;
    button: number;
  } | null = null;
  private myWorldPointerMoveAt = 0;

  private particleGeo: THREE.BoxGeometry;
  private particleMat: THREE.MeshStandardMaterial;
  private particleMesh: THREE.InstancedMesh;
  private particlePool: VoxelParticlePool;

  // Dynamic weather & in-game clock state
  private inGameMinutes = DEFAULT_START_MINUTES;
  private rainIntensity = 0;
  private lastWeatherEmitKey = '';
  private baseSkyColor = new THREE.Color(0x8ad4ff);
  private baseFogColor = new THREE.Color(0xaee3ff);
  private baseFogDensity = 0.014;
  private rainGeo: THREE.BoxGeometry;
  private rainMat: THREE.MeshBasicMaterial;
  private rainMesh: THREE.InstancedMesh;
  private rainPool: RainPool;
  private sunDiscGeo: THREE.BoxGeometry;
  private sunDiscMat: THREE.MeshBasicMaterial;
  private sunDiscMesh: THREE.Mesh;
  private cloudMat: THREE.MeshStandardMaterial;
  private cloudGroup: THREE.Group;
  private cloudSprites: { group: THREE.Group; x: number; speed: number }[] = [];
  private cloudDisposables: THREE.BufferGeometry[] = [];

  // Gameplay state (mutated without React re-renders)
  private phase: GamePhase = 'title';
  private activeHero: HeroCharacter = 'bryan';
  private playerX = 0;
  private playerY = 0;
  private playerZ = 5.5;
  private playerVelY = 0;
  private playerYaw = Math.PI; // facing -Z toward beacons & monument
  private walkDistance = 0;
  private isGrounded = true;

  private partnerX = -1.6;
  private partnerY = 0;
  private partnerZ = 6.4;
  private partnerYaw = Math.PI;

  private sparkyX = 1.4;
  private sparkyY = 1.6;
  private sparkyZ = 5.8;

  private clickTarget: { x: number; z: number } | null = null;
  private pendingInteractBeacon: number | null = null;
  private nearestBeaconIdx: number | null = null;

  private timeLeft = 150;
  private lastReportedSecond = 150;
  private timerPaused = false;
  private questModalOpen = false;
  private cameraTrauma = 0;

  // Input tracking
  private heldKeys = new Set<string>();
  private jumpQueued = false;
  private interactQueued = false;
  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  private lastTickMs = 0;
  private elapsed = 0;
  private frameId = 0;
  private disposed = false;

  // Track disposable stage assets
  private stageDisposables: { dispose: () => void }[] = [];

  constructor(container: HTMLElement, callbacks: VoxelWorldCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      preserveDrawingBuffer: this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const rect = container.getBoundingClientRect();
    const w = Math.max(rect.width || window.innerWidth, 320);
    const h = Math.max(rect.height || window.innerHeight, 240);
    this.renderer.setSize(w, h);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8ad4ff);
    this.scene.fog = new THREE.FogExp2(0xaee3ff, 0.014);

    // Mandatory Studio Reflection Map on every device
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 140);
    this.camera.position.set(0, 9.5, 16.5);
    this.camera.lookAt(0, 1.5, 0);

    // Warm/Cool Lighting Contrast
    this.hemiLight = new THREE.HemisphereLight(0xa5d8ff, 0x5c4033, 0.72);
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(0xfff1d6, 1.45);
    this.keyLight.position.set(14, 22, 12);
    this.keyLight.castShadow = !this.isSoftwareGl;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 2;
    this.keyLight.shadow.camera.far = 55;
    this.keyLight.shadow.camera.left = -16;
    this.keyLight.shadow.camera.right = 16;
    this.keyLight.shadow.camera.top = 16;
    this.keyLight.shadow.camera.bottom = -16;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    rimLight.position.set(-12, 10, -14);
    this.scene.add(rimLight);

    this.stageGroup = new THREE.Group();
    this.myWorldTerrainGroup = new THREE.Group();
    this.myWorldGroup = new THREE.Group();
    this.dynamicGroup = new THREE.Group();
    this.scene.add(this.stageGroup);
    this.scene.add(this.myWorldTerrainGroup);
    this.scene.add(this.myWorldGroup);
    this.scene.add(this.dynamicGroup);

    // My World shared block geometries & translucent placement preview cursor
    this.myWorldBlockGeo = new THREE.BoxGeometry(1, 1, 1);
    this.myWorldCapGeo = new THREE.BoxGeometry(0.82, 0.1, 0.82);
    this.myWorldEdgeGeo = new THREE.EdgesGeometry(this.myWorldBlockGeo);
    this.myWorldEdgeMat = new THREE.LineBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.38,
    });
    this.myWorldPreviewMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    this.myWorldPreviewMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.04, 1.04, 1.04),
      this.myWorldPreviewMat,
    );
    const previewWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.06, 1.06, 1.06)),
      new THREE.LineBasicMaterial({ color: 0xffffff }),
    );
    this.myWorldPreviewMesh.add(previewWire);
    this.myWorldPreviewMesh.visible = false;
    this.scene.add(this.myWorldPreviewMesh);

    // Build Bryan, Caden & Sparky + Contact Shadows
    this.shadowTex = createContactShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.shadowTex,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const shadowGeo = new THREE.CircleGeometry(0.68, 16);

    this.bryan = buildMatchBoyModel('bryan');
    this.caden = buildMatchBoyModel('caden');
    this.sparky = buildSparkyCompanion();

    this.bryanShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.bryanShadow.rotation.x = -Math.PI / 2;
    this.bryanShadow.position.y = 0.02;

    this.cadenShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.cadenShadow.rotation.x = -Math.PI / 2;
    this.cadenShadow.position.y = 0.02;

    this.dynamicGroup.add(
      this.bryan.root,
      this.caden.root,
      this.sparky.root,
      this.bryanShadow,
      this.cadenShadow,
    );

    // Pooled InstancedMesh voxel particle & confetti ring buffer
    this.particleGeo = new THREE.BoxGeometry(1, 1, 1);
    this.particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.12,
    });
    this.particleMesh = new THREE.InstancedMesh(
      this.particleGeo,
      this.particleMat,
      PARTICLE_POOL_SIZE,
    );
    this.particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.particleMesh.frustumCulled = false;
    this.particlePool = createVoxelParticlePool(PARTICLE_POOL_SIZE);
    this.syncParticlesToMesh();
    this.scene.add(this.particleMesh);

    // Dynamic Weather Sky: Voxel Sun Disc, Stepped Clouds & Pooled InstancedMesh Rain
    this.sunDiscGeo = new THREE.BoxGeometry(2.8, 2.8, 0.5);
    this.sunDiscMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.96,
      fog: false,
    });
    this.sunDiscMesh = new THREE.Mesh(this.sunDiscGeo, this.sunDiscMat);
    this.sunDiscMesh.position.set(8, 8.5, -30);
    this.scene.add(this.sunDiscMesh);

    this.cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0,
      fog: false,
    });
    this.cloudGroup = new THREE.Group();
    const cloudConfigs: [number, number, number, number, number][] = [
      [-18, 5.2, -25, 1.35, 0.42],
      [-7, 6.4, -29, 1.55, 0.32],
      [4, 5.4, -26, 1.3, 0.48],
      [16, 6.1, -28, 1.45, 0.36],
      [-12, 6.8, -21, 1.1, 0.4],
      [11, 6.6, -22, 1.15, 0.3],
    ];
    const cloudBaseGeo = new THREE.BoxGeometry(3.4, 0.85, 1.8);
    const cloudTopGeo = new THREE.BoxGeometry(2.1, 0.7, 1.3);
    this.cloudDisposables.push(cloudBaseGeo, cloudTopGeo);
    for (const [cx, cy, cz, sc, speed] of cloudConfigs) {
      const cGroup = new THREE.Group();
      const lower = new THREE.Mesh(cloudBaseGeo, this.cloudMat);
      const upper = new THREE.Mesh(cloudTopGeo, this.cloudMat);
      upper.position.set(0.25, 0.55, 0);
      cGroup.add(lower, upper);
      cGroup.position.set(cx, cy, cz);
      cGroup.scale.setScalar(sc);
      this.cloudGroup.add(cGroup);
      this.cloudSprites.push({ group: cGroup, x: cx, speed });
    }
    this.scene.add(this.cloudGroup);

    this.rainGeo = new THREE.BoxGeometry(0.08, 0.92, 0.08);
    this.rainMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      fog: false,
    });
    this.rainMesh = new THREE.InstancedMesh(
      this.rainGeo,
      this.rainMat,
      RAIN_POOL_SIZE,
    );
    this.rainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.rainMesh.frustumCulled = false;
    this.rainMesh.visible = false;
    this.rainPool = createRainPool(RAIN_POOL_SIZE, 15);
    this.scene.add(this.rainMesh);

    // Bind events
    this.bindEvents();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.lastTickMs = performance.now();
    this.tick();
  }

  private bindEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    this.renderer.domElement.addEventListener('contextmenu', this.handleContextMenu);
  }

  private unbindEvents() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.renderer.domElement.removeEventListener('contextmenu', this.handleContextMenu);
  }

  private handleResize = () => {
    if (this.disposed) return;
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(rect.width || window.innerWidth, 320);
    const h = Math.max(rect.height || window.innerHeight, 240);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.render(this.scene, this.camera);
  };

  private handleBlur = () => {
    this.heldKeys.clear();
    this.pointerDragState = null;
  };

  private handleVisibility = () => {
    if (document.hidden) {
      this.heldKeys.clear();
      this.pointerDragState = null;
    }
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (this.phase === 'myworld') {
      e.preventDefault();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if ((this.phase !== 'playing' && this.phase !== 'myworld') || this.questModalOpen) {
      return;
    }

    const code = e.code;
    if (
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'ArrowLeft' ||
      code === 'ArrowRight' ||
      code === 'Space'
    ) {
      e.preventDefault();
    }

    if (!e.repeat) {
      if (code === 'Space') this.jumpQueued = true;
      if (code === 'Tab') {
        e.preventDefault();
        this.callbacks.onSwitchHero();
      }
      if (code === 'KeyV') {
        this.callbacks.onToggleCameraView?.();
      }
      if (this.phase === 'playing') {
        if (code === 'KeyE' || code === 'Enter') this.interactQueued = true;
        if (code === 'KeyP') {
          this.callbacks.onTogglePause();
        }
      } else if (this.phase === 'myworld') {
        if (code === 'KeyQ' && this.cameraViewMode === 'third_person') {
          this.rotateMyWorldCamera(-1);
        } else if (code === 'KeyR' && this.cameraViewMode === 'third_person') {
          this.rotateMyWorldCamera(1);
        } else if (code === 'KeyX') {
          this.callbacks.onToggleMyWorldTool?.();
        } else if (code === 'KeyF') {
          this.actOnFrontCell();
        } else if (code.startsWith('Digit')) {
          const num = Number.parseInt(code.replace('Digit', ''), 10);
          if (num >= 1 && num <= 9) {
            this.callbacks.onSelectHotbarIndex?.(num - 1);
          }
        }
      }
    }

    this.heldKeys.add(code);
    this.clickTarget = null;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.heldKeys.delete(e.code);
  };

  private computeMyWorldRaycastNdc(
    ndcX: number,
    ndcY: number,
    mode: MyWorldTool,
    maxDistance = 60,
  ): {
    kind: 'block' | 'terrain';
    x: number;
    y: number;
    z: number;
    valid: boolean;
    isBlockHit: boolean;
    terrainDepth?: number;
  } | null {
    this.pointerNdc.set(ndcX, ndcY);
    this.raycaster.layers.set(0);
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    const blockHits = this.raycaster
      .intersectObjects(this.myWorldBlockMeshes, false)
      .filter((h) => h.distance <= maxDistance);
    const terrainHits = this.raycaster
      .intersectObjects(this.myWorldTerrainMeshes, false)
      .filter((h) => h.distance <= maxDistance);

    const firstBlock = blockHits[0];
    const firstTerrain = terrainHits[0];

    const hitBlockFirst =
      Boolean(firstBlock) && (!firstTerrain || firstBlock.distance <= firstTerrain.distance);

    if (hitBlockFirst && firstBlock) {
      const { blockX, blockY, blockZ } = firstBlock.object.userData as {
        blockX: number;
        blockY: number;
        blockZ: number;
      };
      if (mode === 'dig') {
        return {
          kind: 'block',
          x: blockX,
          y: blockY,
          z: blockZ,
          valid: true,
          isBlockHit: true,
        };
      }
      const nx = firstBlock.face ? Math.round(firstBlock.face.normal.x) : 0;
      const ny = firstBlock.face ? Math.round(firstBlock.face.normal.y) : 1;
      const nz = firstBlock.face ? Math.round(firstBlock.face.normal.z) : 0;
      const tx = blockX + nx;
      const ty = blockY + ny;
      const tz = blockZ + nz;
      const valid =
        isValidBlockCoord(tx, ty, tz, this.myWorldBounds, this.myWorldDugDepths) &&
        !this.myWorldOccupiedKeys.has(blockKey(tx, ty, tz)) &&
        !this.isBlockOverlappingActor(tx, ty, tz) &&
        this.myWorldSelectedHasStock;
      return { kind: 'block', x: tx, y: ty, z: tz, valid, isBlockHit: true };
    }

    if (firstTerrain && firstTerrain.instanceId !== undefined) {
      const coords = this.myWorldTerrainCoords.get(firstTerrain.object);
      const cell = coords?.[firstTerrain.instanceId];
      if (cell) {
        const voxelY = cell.topY - 1; // topY=0 -> voxelY=-1; topY=-1 -> voxelY=-2; topY=-2 -> voxelY=-3
        if (mode === 'dig') {
          const depth = this.myWorldDugDepths[groundColKey(cell.x, cell.z)] ?? 0;
          const canDig = depth < MAX_DIG_DEPTH;
          return {
            kind: 'terrain',
            x: cell.x,
            y: voxelY,
            z: cell.z,
            valid: canDig,
            isBlockHit: false,
            terrainDepth: depth,
          };
        }
        const nx = firstTerrain.face ? Math.round(firstTerrain.face.normal.x) : 0;
        const ny = firstTerrain.face ? Math.round(firstTerrain.face.normal.y) : 1;
        const nz = firstTerrain.face ? Math.round(firstTerrain.face.normal.z) : 0;
        const tx = cell.x + nx;
        const ty = voxelY + ny;
        const tz = cell.z + nz;
        const valid =
          isValidBlockCoord(tx, ty, tz, this.myWorldBounds, this.myWorldDugDepths) &&
          !this.myWorldOccupiedKeys.has(blockKey(tx, ty, tz)) &&
          !this.isBlockOverlappingActor(tx, ty, tz) &&
          this.myWorldSelectedHasStock;
        return { kind: 'terrain', x: tx, y: ty, z: tz, valid, isBlockHit: false };
      }
    }

    if (
      mode === 'build' &&
      this.raycaster.ray.intersectPlane(this.groundPlane, _vec3) &&
      _vec3.distanceTo(this.camera.position) <= maxDistance
    ) {
      const tx = Math.round(_vec3.x);
      const tz = Math.round(_vec3.z);
      const floorY = getGroundTopY(tx, tz, this.myWorldDugDepths);
      const valid =
        isValidBlockCoord(tx, floorY, tz, this.myWorldBounds, this.myWorldDugDepths) &&
        !this.myWorldOccupiedKeys.has(blockKey(tx, floorY, tz)) &&
        !this.isBlockOverlappingActor(tx, floorY, tz) &&
        this.myWorldSelectedHasStock;
      return { kind: 'terrain', x: tx, y: floorY, z: tz, valid, isBlockHit: false };
    }

    return null;
  }

  private computeMyWorldRaycastTarget(
    clientX: number,
    clientY: number,
    mode: MyWorldTool,
  ) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    return this.computeMyWorldRaycastNdc(ndcX, ndcY, mode);
  }

  private updateMyWorldPreviewFromTarget(
    target: ReturnType<VoxelWorldController['computeMyWorldRaycastNdc']>,
  ) {
    if (!target) {
      this.myWorldPreviewMesh.visible = false;
      return;
    }

    if (this.myWorldTool === 'dig') {
      if (target.isBlockHit) {
        this.myWorldPreviewMesh.visible = true;
        this.myWorldPreviewMesh.position.set(target.x, target.y + 0.5, target.z);
        this.myWorldPreviewMat.color.setHex(0xf43f5e);
        return;
      }
      this.myWorldPreviewMesh.visible = true;
      this.myWorldPreviewMesh.position.set(target.x, target.y + 0.54, target.z);
      this.myWorldPreviewMat.color.setHex(target.valid ? 0xf59e0b : 0x64748b);
      return;
    }

    if (!isValidBlockCoord(target.x, target.y, target.z, this.myWorldBounds, this.myWorldDugDepths)) {
      this.myWorldPreviewMesh.visible = false;
      return;
    }

    this.myWorldPreviewMesh.visible = true;
    this.myWorldPreviewMesh.position.set(target.x, target.y + 0.5, target.z);
    this.myWorldPreviewMat.color.setHex(target.valid ? 0x10b981 : 0xf43f5e);
  }

  private executeMyWorldActionAtTarget(
    target: ReturnType<VoxelWorldController['computeMyWorldRaycastNdc']>,
    effectiveMode: MyWorldTool,
  ) {
    if (!target) return;

    if (effectiveMode === 'dig') {
      if (target.isBlockHit) {
        this.callbacks.onDigMyWorldCell?.(target.x, target.z, target.y);
      } else {
        this.callbacks.onDigMyWorldCell?.(target.x, target.z);
      }
    } else if (
      isValidBlockCoord(target.x, target.y, target.z, this.myWorldBounds, this.myWorldDugDepths) &&
      !this.myWorldOccupiedKeys.has(blockKey(target.x, target.y, target.z))
    ) {
      this.callbacks.onPlaceMyWorldBlock?.(target.x, target.y, target.z);
    }
  }

  private executePlayingClick(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // First check Quest Beacons on Layer 1
    this.raycaster.layers.set(1);
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const beaconHits = this.raycaster.intersectObjects(this.beaconHitMeshes, false);

    if (beaconHits.length > 0) {
      const idx = beaconHits[0].object.userData.beaconIndex as number;
      if (!this.beaconCompleted[idx]) {
        const [bx, bz] = BEACON_COORDS[idx];
        const dist = Math.hypot(bx - this.playerX, bz - this.playerZ);
        if (dist <= 3.1) {
          this.callbacks.onInteractBeacon(idx);
        } else {
          this.clickTarget = { x: bx, z: bz + 1.6 };
          this.pendingInteractBeacon = idx;
        }
        return;
      }
    }

    if (this.cameraViewMode === 'third_person') {
      this.raycaster.layers.set(0);
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      if (this.raycaster.ray.intersectPlane(this.groundPlane, _vec3)) {
        const clamped = clampPlayerPosition(_vec3.x, _vec3.z, ARENA_HALF_EXTENT);
        this.clickTarget = clamped;
        this.pendingInteractBeacon = null;
      }
    }
  }

  private handlePointerMove = (e: PointerEvent) => {
    if (this.questModalOpen) {
      if (this.myWorldPreviewMesh.visible) {
        this.myWorldPreviewMesh.visible = false;
      }
      return;
    }

    if (
      this.cameraViewMode === 'first_person' &&
      this.pointerDragState?.active &&
      (this.phase === 'myworld' || this.phase === 'playing')
    ) {
      const dx = e.clientX - this.pointerDragState.lastX;
      const dy = e.clientY - this.pointerDragState.lastY;
      this.pointerDragState.moved += Math.hypot(dx, dy);
      this.pointerDragState.lastX = e.clientX;
      this.pointerDragState.lastY = e.clientY;
      this.playerYaw -= dx * 0.0055;
      this.firstPersonPitch = Math.max(
        -1.0,
        Math.min(0.9, this.firstPersonPitch - dy * 0.0045),
      );
      return;
    }

    if (this.phase !== 'myworld') {
      if (this.myWorldPreviewMesh.visible) {
        this.myWorldPreviewMesh.visible = false;
      }
      return;
    }

    if (this.cameraViewMode === 'first_person') {
      return;
    }

    const now = performance.now();
    if (now - this.myWorldPointerMoveAt < 28) return;
    this.myWorldPointerMoveAt = now;

    const target = this.computeMyWorldRaycastTarget(
      e.clientX,
      e.clientY,
      this.myWorldTool,
    );
    this.updateMyWorldPreviewFromTarget(target);
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (this.questModalOpen) return;

    if (
      this.cameraViewMode === 'first_person' &&
      (this.phase === 'myworld' || this.phase === 'playing')
    ) {
      this.pointerDragState = {
        active: true,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: 0,
        button: e.button,
      };
      return;
    }

    if (this.phase === 'myworld') {
      const effectiveMode: MyWorldTool =
        e.button === 2 ? 'dig' : this.myWorldTool;
      const target = this.computeMyWorldRaycastTarget(
        e.clientX,
        e.clientY,
        effectiveMode,
      );
      this.executeMyWorldActionAtTarget(target, effectiveMode);
      return;
    }

    if (this.phase !== 'playing') return;
    this.executePlayingClick(e.clientX, e.clientY);
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (!this.pointerDragState) return;
    const { moved, button } = this.pointerDragState;
    this.pointerDragState = null;
    if (moved >= 6 || this.questModalOpen) return;

    if (this.phase === 'myworld') {
      const effectiveMode: MyWorldTool =
        button === 2 ? 'dig' : this.myWorldTool;
      const target = this.computeMyWorldRaycastNdc(0, 0, effectiveMode, 7.5);
      this.executeMyWorldActionAtTarget(target, effectiveMode);
    } else if (this.phase === 'playing') {
      this.executePlayingClick(e.clientX, e.clientY);
    }
  };

  public clearInputs() {
    this.heldKeys.clear();
    this.pointerDragState = null;
    this.jumpQueued = false;
    this.interactQueued = false;
    this.clickTarget = null;
  }

  public setPhase(phase: GamePhase) {
    this.phase = phase;
    if (phase !== 'myworld') {
      this.myWorldPreviewMesh.visible = false;
    }
    if (phase !== 'playing' && phase !== 'myworld') {
      this.clearInputs();
    }
    this.syncActorTransforms(0);
  }

  public setQuestModalOpen(open: boolean) {
    this.questModalOpen = open;
    if (open) {
      this.clearInputs();
    }
  }

  public setActiveHero(hero: HeroCharacter) {
    if (this.activeHero !== hero) {
      this.activeHero = hero;
      // Swap positions cleanly so player stays at same spot
      const prevX = this.playerX;
      const prevY = this.playerY;
      const prevZ = this.playerZ;
      this.playerX = this.partnerX;
      this.playerY = this.partnerY;
      this.playerZ = this.partnerZ;
      this.partnerX = prevX;
      this.partnerY = prevY;
      this.partnerZ = prevZ;
      this.playerVelY = 0;
      this.isGrounded = true;
      emitVoxelBurst(this.particlePool, {
        x: this.playerX,
        y: this.playerY + 1.2,
        z: this.playerZ,
        colorHex: hero === 'bryan' ? 0xf97316 : 0x38bdf8,
        count: 14,
      });
      soundFX.playSwitchHero();
    }
  }

  public setTimerPaused(paused: boolean) {
    this.timerPaused = paused;
  }

  public getActiveParticleCount(): number {
    return this.particlePool.activeCount;
  }

  public triggerQuestConfetti(beaconIndex: number, accentColor?: string | number) {
    const beacon = this.beacons[beaconIndex];
    const coords = BEACON_COORDS[beaconIndex];
    const bx = beacon ? beacon.root.position.x : coords?.[0] ?? 0;
    const bz = beacon ? beacon.root.position.z : coords?.[1] ?? 0;

    emitConfettiExplosion(this.particlePool, {
      x: bx,
      y: 1.75,
      z: bz,
      accentColor,
      confettiCount: 76,
      sparkCount: 26,
    });
    this.cameraTrauma = Math.min(1, this.cameraTrauma + 0.45);
    soundFX.playConfettiPop();
    this.syncParticlesToMesh();
  }

  public setBeaconCompleted(
    index: number,
    completed: boolean,
    celebrate = true,
    accentColor?: string | number,
  ) {
    this.beaconCompleted[index] = completed;
    const beacon = this.beacons[index];
    if (!beacon) return;

    const colorHex = completed ? 0x10b981 : 0xf59e0b;
    beacon.crystal.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.color.setHex(colorHex);
          mat.emissive.setHex(colorHex);
        }
      }
    });
    (beacon.beam.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    (beacon.beam.material as THREE.MeshBasicMaterial).opacity = completed ? 0.38 : 0.22;
    (beacon.ring.material as THREE.MeshBasicMaterial).color.setHex(colorHex);

    if (completed && celebrate) {
      this.triggerQuestConfetti(index, accentColor);
    }
  }

  public setMyWorldState(tool: MyWorldTool, selectedHasStock: boolean) {
    this.myWorldTool = tool;
    this.myWorldSelectedHasStock = selectedHasStock;
  }

  public setCameraViewMode(mode: CameraViewMode) {
    this.cameraViewMode = mode;
    if (mode === 'first_person') {
      this.firstPersonPitch = -0.24;
    }
    this.container.dataset.cameraView = mode;
    this.syncActorTransforms(0);
  }

  public rotateMyWorldCamera(step: -1 | 1) {
    if (this.cameraViewMode === 'first_person') {
      this.playerYaw -= step * (Math.PI / 6);
    } else {
      this.myWorldCameraYawTarget += step * (Math.PI / 4);
    }
  }

  public isBlockOverlappingActor(x: number, y: number, z: number): boolean {
    const gx = Math.round(x);
    const gy = Math.round(y);
    const gz = Math.round(z);
    return (
      doesBlockOverlapActor(gx, gy, gz, this.playerX, this.playerY, this.playerZ) ||
      doesBlockOverlapActor(gx, gy, gz, this.partnerX, this.partnerY, this.partnerZ)
    );
  }

  public actOnFrontCell() {
    if (this.phase !== 'myworld') return;

    // In Self View (1st-person), act on crosshair-aimed block/tile if valid and within reach
    if (this.cameraViewMode === 'first_person') {
      const aimed = this.computeMyWorldRaycastNdc(0, 0, this.myWorldTool, 7.5);
      if (aimed && (this.myWorldTool === 'dig' || aimed.valid)) {
        this.executeMyWorldActionAtTarget(aimed, this.myWorldTool);
        return;
      }
    }

    const fx = Math.round(this.playerX + Math.sin(this.playerYaw) * 1.45);
    const fz = Math.round(this.playerZ + Math.cos(this.playerYaw) * 1.45);
    const clampedX = Math.max(
      this.myWorldBounds.minX,
      Math.min(this.myWorldBounds.maxX, fx),
    );
    const clampedZ = Math.max(
      this.myWorldBounds.minZ,
      Math.min(this.myWorldBounds.maxZ, fz),
    );

    if (this.myWorldTool === 'dig') {
      this.callbacks.onDigMyWorldCell?.(clampedX, clampedZ);
      return;
    }

    // Find highest occupied block in column (clampedX, clampedZ), or dug pit floor
    const groundFloor = getGroundTopY(clampedX, clampedZ, this.myWorldDugDepths);
    let topY = groundFloor - 1;
    for (let y = this.myWorldBounds.maxY; y >= groundFloor; y--) {
      if (this.myWorldOccupiedKeys.has(blockKey(clampedX, y, clampedZ))) {
        topY = y;
        break;
      }
    }

    const targetY = Math.max(groundFloor, topY + 1);
    if (isValidBlockCoord(clampedX, targetY, clampedZ, this.myWorldBounds, this.myWorldDugDepths)) {
      this.callbacks.onPlaceMyWorldBlock?.(clampedX, targetY, clampedZ);
    }
  }

  private getMyWorldMaterials(resourceId: string) {
    const existing = this.myWorldMatCache.get(resourceId);
    if (existing) return existing;

    const spec = this.myWorldResourceSpecs.get(resourceId);
    const color = spec?.color ?? '#a8a29e';
    const accent = spec?.accentColor ?? '#facc15';
    const finish = getBlockFinishStyle(resourceId);

    const tex = createVoxelTileTexture(
      color,
      accent,
      resourceId.length * 41 + resourceId.charCodeAt(0),
      this.maxAnisotropy,
      true,
    );

    const main = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: tex,
      roughness: finish === 'metallic' ? 0.25 : finish === 'emissive' ? 0.3 : 0.78,
      metalness: finish === 'metallic' ? 0.72 : finish === 'emissive' ? 0.2 : 0.06,
      emissive: finish === 'emissive' ? parseHexColor(color) : 0x000000,
      emissiveIntensity: finish === 'emissive' ? 0.32 : 0,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: parseHexColor(accent),
      emissive: finish === 'emissive' ? parseHexColor(accent) : 0x000000,
      emissiveIntensity: finish === 'emissive' ? 0.45 : 0,
      roughness: finish === 'metallic' ? 0.2 : 0.42,
      metalness: finish === 'metallic' ? 0.8 : 0.35,
    });

    const bundle = { main, accent: accentMat, tex };
    this.myWorldMatCache.set(resourceId, bundle);
    return bundle;
  }

  public syncMyWorldBlocks(blocks: PlacedVoxelBlock[]) {
    this.myWorldPlacedBlocks = blocks;
    while (this.myWorldGroup.children.length > 0) {
      this.myWorldGroup.remove(this.myWorldGroup.children[0]);
    }
    this.myWorldBlockMeshes = [];
    this.myWorldOccupiedKeys.clear();

    for (const blk of blocks) {
      this.myWorldOccupiedKeys.add(blockKey(blk.x, blk.y, blk.z));
      const mats = this.getMyWorldMaterials(blk.resourceId);

      const mainMesh = new THREE.Mesh(this.myWorldBlockGeo, mats.main);
      mainMesh.position.set(blk.x, blk.y + 0.5, blk.z);
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      mainMesh.userData = {
        blockX: blk.x,
        blockY: blk.y,
        blockZ: blk.z,
      };
      const edgeLine = new THREE.LineSegments(this.myWorldEdgeGeo, this.myWorldEdgeMat);
      mainMesh.add(edgeLine);
      this.myWorldGroup.add(mainMesh);
      this.myWorldBlockMeshes.push(mainMesh);

      const capMesh = new THREE.Mesh(this.myWorldCapGeo, mats.accent);
      capMesh.position.set(blk.x, blk.y + 0.96, blk.z);
      this.myWorldGroup.add(capMesh);
    }
  }

  public notifyMyWorldBlockPlaced(x: number, y: number, z: number, resourceId: string) {
    const spec = this.myWorldResourceSpecs.get(resourceId);
    const hex = parseHexColor(spec?.accentColor ?? spec?.color ?? '#10b981');
    emitVoxelBurst(this.particlePool, {
      x,
      y: y + 0.65,
      z,
      colorHex: hex,
      count: 14,
    });
    soundFX.playBlockPlace();
    this.syncParticlesToMesh();
  }

  public notifyMyWorldBlockRemoved(x: number, y: number, z: number, resourceId: string) {
    const spec = this.myWorldResourceSpecs.get(resourceId);
    const hex = parseHexColor(spec?.color ?? '#f43f5e');
    emitVoxelBurst(this.particlePool, {
      x,
      y: y + 0.5,
      z,
      colorHex: hex,
      count: 16,
    });
    soundFX.playBlockBreak();
    this.syncParticlesToMesh();
  }

  private collectDisposablesFromObject(root: THREE.Object3D) {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        if (mesh.geometry) this.stageDisposables.push(mesh.geometry);
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => this.stageDisposables.push(m));
        } else if (mesh.material) {
          this.stageDisposables.push(mesh.material);
        }
      }
    });
  }

  private ensureMyWorldTerrainMaterials() {
    if (this.myWorldTerrainMats) return this.myWorldTerrainMats;
    const bumpTex = createVoxelBumpTexture(911, this.maxAnisotropy);
    const gridTex = createVoxelTileTexture('#b8c4d4', '#94a3b8', 909, this.maxAnisotropy, true);
    const subsoilTex = createVoxelTileTexture('#854d0e', '#57534e', 915, this.maxAnisotropy, true);
    const bedrockTex = createVoxelTileTexture('#334155', '#1e293b', 921, this.maxAnisotropy, true);

    const plaza = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: gridTex,
      bumpMap: bumpTex,
      bumpScale: 0.025,
      roughness: 0.72,
    });
    const subsoil = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: subsoilTex,
      bumpMap: bumpTex,
      bumpScale: 0.035,
      roughness: 0.88,
    });
    const bedrock = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: bedrockTex,
      bumpMap: bumpTex,
      bumpScale: 0.04,
      roughness: 0.92,
    });
    this.myWorldTerrainMats = {
      plaza,
      subsoil,
      bedrock,
      textures: [bumpTex, gridTex, subsoilTex, bedrockTex],
    };
    return this.myWorldTerrainMats;
  }

  public syncMyWorldTerrain(dugDepths: Record<string, number>) {
    this.myWorldDugDepths = { ...dugDepths };
    while (this.myWorldTerrainGroup.children.length > 0) {
      const child = this.myWorldTerrainGroup.children[0] as THREE.InstancedMesh;
      this.myWorldTerrainGroup.remove(child);
      child.dispose?.();
    }
    this.myWorldTerrainMeshes = [];
    this.myWorldTerrainCoords.clear();

    const mats = this.ensureMyWorldTerrainMaterials();
    const { minX, maxX, minZ, maxZ } = this.myWorldBounds;

    const topCells: { x: number; z: number; topY: number }[] = [];
    const subsoilCells: { x: number; z: number; topY: number }[] = [];
    const bedrockCells: { x: number; z: number; topY: number }[] = [];

    const depthAt = (x: number, z: number) =>
      this.myWorldDugDepths[groundColKey(x, z)] ?? 0;

    for (let gx = minX; gx <= maxX; gx++) {
      for (let gz = minZ; gz <= maxZ; gz++) {
        const d = Math.max(0, Math.min(MAX_DIG_DEPTH, depthAt(gx, gz)));
        const neighborDug =
          depthAt(gx - 1, gz) > 0 ||
          depthAt(gx + 1, gz) > 0 ||
          depthAt(gx, gz - 1) > 0 ||
          depthAt(gx, gz + 1) > 0;
        const neighborDeep =
          depthAt(gx - 1, gz) >= 2 ||
          depthAt(gx + 1, gz) >= 2 ||
          depthAt(gx, gz - 1) >= 2 ||
          depthAt(gx, gz + 1) >= 2;

        if (d === 0) {
          topCells.push({ x: gx, z: gz, topY: 0 });
          if (neighborDug) subsoilCells.push({ x: gx, z: gz, topY: -1 });
          if (neighborDeep) bedrockCells.push({ x: gx, z: gz, topY: -2 });
        } else if (d === 1) {
          subsoilCells.push({ x: gx, z: gz, topY: -1 });
          if (neighborDeep) bedrockCells.push({ x: gx, z: gz, topY: -2 });
        } else {
          bedrockCells.push({ x: gx, z: gz, topY: -2 });
        }
      }
    }

    const addLayer = (
      cells: { x: number; z: number; topY: number }[],
      mat: THREE.MeshStandardMaterial,
    ) => {
      if (cells.length === 0) return;
      const inst = new THREE.InstancedMesh(this.myWorldBlockGeo, mat, cells.length);
      inst.receiveShadow = true;
      inst.castShadow = true;
      cells.forEach((c, idx) => {
        _dummy.position.set(c.x, c.topY - 0.5, c.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        inst.setMatrixAt(idx, _dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;
      inst.computeBoundingSphere();
      this.myWorldTerrainGroup.add(inst);
      this.myWorldTerrainMeshes.push(inst);
      this.myWorldTerrainCoords.set(inst, cells);
    };

    addLayer(topCells, mats.plaza);
    addLayer(subsoilCells, mats.subsoil);
    addLayer(bedrockCells, mats.bedrock);
  }

  public notifyMyWorldTerrainDug(x: number, y: number, z: number) {
    emitVoxelBurst(this.particlePool, {
      x,
      y: y + 0.5,
      z,
      colorHex: 0xa16207,
      count: 16,
    });
    soundFX.playBlockBreak();
    this.syncParticlesToMesh();
  }

  public loadMyWorld(
    blocks: PlacedVoxelBlock[],
    resourceSpecs: TopicStage['rewardResource'][],
    layout?: MyWorldLayout,
    dugDepths: Record<string, number> = {},
  ) {
    this.myWorldResourceSpecs.clear();
    for (const r of resourceSpecs) {
      this.myWorldResourceSpecs.set(r.id, r);
    }

    const activeLayout = layout ?? computeMyWorldLayout([], []);
    this.myWorldBounds = activeLayout.bounds;
    this.myWorldIslandRadius = activeLayout.islandRadius;
    this.myWorldExtraColliders = [];
    this.myWorldFloatingProps = [];

    // Clear previous stage geometry
    while (this.stageGroup.children.length > 0) {
      this.stageGroup.remove(this.stageGroup.children[0]);
    }
    for (const d of this.stageDisposables) {
      d.dispose();
    }
    this.stageDisposables = [];
    this.beacons = [];
    this.beaconHitMeshes = [];
    this.pickups = [];

    this.baseSkyColor.setHex(0x7dd3fc);
    this.baseFogColor.setHex(0xbde8ff);
    this.baseFogDensity = 0.01;
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.FogExp2(0xbde8ff, 0.01);

    // Spawn Bryan & Caden inside the south plaza entry facing north
    const spawnZ = activeLayout.buildHalfExtent + 1.05;
    this.playerX = 0;
    this.playerY = 0;
    this.playerZ = spawnZ;
    this.playerVelY = 0;
    this.playerYaw = Math.PI;
    this.isGrounded = true;

    this.partnerX = -1.6;
    this.partnerY = 0;
    this.partnerZ = spawnZ + 0.55;
    this.partnerYaw = Math.PI;

    this.sparkyX = 1.4;
    this.sparkyY = 1.65;
    this.sparkyZ = spawnZ + 0.25;

    this.myWorldCameraYaw = Math.PI / 9;
    this.myWorldCameraYawTarget = Math.PI / 9;
    this.timerPaused = true;
    this.clickTarget = null;
    this.pendingInteractBeacon = null;
    this.nearestBeaconIdx = null;
    this.myWorldPreviewMesh.visible = false;
    resetVoxelParticlePool(this.particlePool);
    this.syncParticlesToMesh();

    // 1. Dynamic Sandbox Island Outer Biome Rim
    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    const bumpTex = createVoxelBumpTexture(707, this.maxAnisotropy);
    const meadowTex = createVoxelTileTexture(
      '#f8fafc',
      '#cbd5e1',
      808,
      this.maxAnisotropy,
    );

    const meadowMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: meadowTex,
      bumpMap: bumpTex,
      bumpScale: 0.03,
      roughness: 0.85,
    });
    this.stageDisposables.push(blockGeo, bumpTex, meadowTex, meadowMat);

    const grassCells: { x: number; z: number }[] = [];
    const radius = activeLayout.islandRadius;
    for (let gx = -radius; gx <= radius; gx++) {
      for (let gz = -radius; gz <= radius; gz++) {
        const inBuildZone =
          gx >= activeLayout.bounds.minX &&
          gx <= activeLayout.bounds.maxX &&
          gz >= activeLayout.bounds.minZ &&
          gz <= activeLayout.bounds.maxZ;
        if (!inBuildZone) grassCells.push({ x: gx, z: gz });
      }
    }

    const grassInst = new THREE.InstancedMesh(blockGeo, meadowMat, grassCells.length);
    grassInst.receiveShadow = true;
    grassCells.forEach((p, idx) => {
      _dummy.position.set(p.x, -1.5, p.z);
      _dummy.scale.set(1, 3, 1);
      _dummy.updateMatrix();
      grassInst.setMatrixAt(idx, _dummy.matrix);

      // Tint outer terrain rim tiles by nearest unlocked Topic Biome when inside 4.8 tiles
      let tileColor = 0x4ade80;
      let bestDistSq = 23.0;
      for (const el of activeLayout.topicElements) {
        const dx = p.x - el.x;
        const dz = p.z - el.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          const pal = BIOME_PALETTES[el.stage.biome] ?? BIOME_PALETTES.earth_crust;
          tileColor = parseHexColor(pal.groundTop);
        }
      }
      _color.setHex(tileColor);
      grassInst.setColorAt(idx, _color);
    });
    grassInst.instanceMatrix.needsUpdate = true;
    if (grassInst.instanceColor) grassInst.instanceColor.needsUpdate = true;
    grassInst.computeBoundingSphere();
    this.stageGroup.add(grassInst);

    // Diggable 3-layer My World Plaza Terrain
    this.syncMyWorldTerrain(dugDepths);

    // 2. Water apron sized comfortably for full expansion, sitting cleanly below bedrock pits (y = -2.85)
    const waterSpan = Math.max(220, radius * 10);
    const waterGeo = new THREE.PlaneGeometry(waterSpan, waterSpan);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.22,
      metalness: 0.25,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -2.85;
    waterMesh.receiveShadow = true;
    this.stageGroup.add(waterMesh);
    this.stageDisposables.push(waterGeo, waterMat);

    // 3. Corner Voxel Trees & Natural Stepped Perimeter Hills (added once stages unlock)
    const treeEdge = radius - 0.55;
    const treePositions: [number, number, number][] = [
      [-treeEdge, -treeEdge, 1.05],
      [treeEdge, -treeEdge, 1.1],
      [-treeEdge, treeEdge, 0.95],
      [treeEdge, treeEdge, 1.0],
    ];
    for (const [tx, tz, sc] of treePositions) {
      const tree = buildVoxelTree(0x78350f, 0x22c55e, 0x16a34a, sc);
      tree.position.set(tx, 0, tz);
      this.collectDisposablesFromObject(tree);
      this.stageGroup.add(tree);
    }

    if (activeLayout.completedStages.length > 0) {
      // Natural raised voxel hills & boulders framing the expanded outer corners
      const hillCoords: [number, number, number, number][] = [
        [-radius + 0.5, -radius + 2.2, 1.2, 0x65a30d],
        [-radius + 2.2, -radius + 0.5, 0.9, 0x78716c],
        [radius - 0.5, -radius + 2.2, 1.25, 0x65a30d],
        [radius - 2.2, -radius + 0.5, 0.95, 0x78716c],
        [-radius + 0.5, radius - 2.2, 1.0, 0x4ade80],
        [radius - 0.5, radius - 2.2, 1.0, 0x4ade80],
      ];
      const hillGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
      this.stageDisposables.push(hillGeo);
      for (const [hx, hz, hh, hcol] of hillCoords) {
        const hMat = new THREE.MeshStandardMaterial({ color: hcol, roughness: 0.85 });
        this.stageDisposables.push(hMat);
        const hill = new THREE.Mesh(hillGeo, hMat);
        hill.position.set(hx, hh * 0.5, hz);
        hill.scale.set(1, hh, 1);
        hill.castShadow = true;
        hill.receiveShadow = true;
        this.stageGroup.add(hill);
        this.myWorldExtraColliders.push({
          minX: hx - 0.75,
          maxX: hx + 0.75,
          minY: 0,
          maxY: hh,
          minZ: hz - 0.75,
          maxZ: hz + 0.75,
        });
      }
    }

    // 4. Welcoming North Trophy Arch + solid colliders for its two pillars
    const archZ = -(activeLayout.buildHalfExtent + 2.1);
    const arch = buildMyWorldArchMonument();
    arch.position.set(0, 0, archZ);
    this.collectDisposablesFromObject(arch);
    this.stageGroup.add(arch);
    [-2.6, 2.6].forEach((px) => {
      this.myWorldExtraColliders.push({
        minX: px - 0.7,
        maxX: px + 0.7,
        minY: 0,
        maxY: 4.2,
        minZ: archZ - 0.7,
        maxZ: archZ + 0.7,
      });
    });

    // 5. Completed Topic Habitat Zones (3D Biome Terrain / Mountain with Lava + Living Things)
    activeLayout.topicElements.forEach((el, idx) => {
      const habitat = buildTopicHabitatZone(el.stage);
      habitat.root.position.set(el.x, 0, el.z);
      this.collectDisposablesFromObject(habitat.root);
      this.stageGroup.add(habitat.root);

      for (const anim of habitat.animatedParts) {
        this.myWorldFloatingProps.push(anim);
      }

      const crystalHeight = el.stage.id === 1 ? 4.4 : 2.75;
      const floatingCrystal = buildResourcePickup(
        el.stage.rewardResource.color,
        el.stage.rewardResource.accentColor,
      );
      floatingCrystal.scale.setScalar(0.65);
      floatingCrystal.position.set(el.x + 1.05, crystalHeight, el.z + 1.05);
      this.collectDisposablesFromObject(floatingCrystal);
      this.stageGroup.add(floatingCrystal);
      this.myWorldFloatingProps.push({
        mesh: floatingCrystal,
        mode: 'bob',
        baseX: el.x + 1.05,
        baseY: crystalHeight,
        baseZ: el.z + 1.05,
        phase: idx * 0.9,
      });

      this.myWorldExtraColliders.push({
        minX: el.x - el.halfFootprint,
        maxX: el.x + el.halfFootprint,
        minY: 0,
        maxY: el.stage.id === 1 ? 2.4 : 0.45,
        minZ: el.z - el.halfFootprint,
        maxZ: el.z + el.halfFootprint,
      });
    });

    this.syncMyWorldBlocks(blocks);
    this.syncActorTransforms(0);

    if (this.cameraViewMode === 'first_person') {
      const pose = computeFirstPersonCameraPose(
        this.playerX,
        this.playerY,
        this.playerZ,
        this.playerYaw,
        this.firstPersonPitch,
      );
      this.camera.position.set(pose.eyeX, pose.eyeY, pose.eyeZ);
      this.camera.lookAt(pose.lookX, pose.lookY, pose.lookZ);
    } else {
      const extraSpan = Math.max(0, activeLayout.buildHalfExtent - 6);
      const camDist = 14.4 + Math.min(6.5, extraSpan * 0.24);
      const camHeight = 9.2 + Math.min(3.5, extraSpan * 0.14);
      const focusX = this.playerX * 0.45;
      const focusZ = this.playerZ * 0.45 - 1.2;
      this.camera.position.set(
        focusX + Math.sin(this.myWorldCameraYaw) * camDist,
        camHeight,
        focusZ + Math.cos(this.myWorldCameraYaw) * camDist,
      );
      this.camera.lookAt(focusX, 1.85, focusZ);
    }
    this.container.dataset.playerPos = `${this.playerX.toFixed(2)},${this.playerY.toFixed(2)},${this.playerZ.toFixed(2)}`;
    this.container.dataset.cameraView = this.cameraViewMode;
    this.updateWeatherSystem(0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  public loadStage(stage: TopicStage, completedStates: boolean[]) {
    // Clear My World blocks & terrain when switching to a Quest Stage
    this.myWorldPlacedBlocks = [];
    this.myWorldExtraColliders = [];
    this.myWorldFloatingProps = [];
    this.myWorldDugDepths = {};
    this.myWorldBounds = MY_WORLD_BOUNDS;
    this.partnerY = 0;
    while (this.myWorldTerrainGroup.children.length > 0) {
      const child = this.myWorldTerrainGroup.children[0] as THREE.InstancedMesh;
      this.myWorldTerrainGroup.remove(child);
      child.dispose?.();
    }
    this.myWorldTerrainMeshes = [];
    this.myWorldTerrainCoords.clear();
    while (this.myWorldGroup.children.length > 0) {
      this.myWorldGroup.remove(this.myWorldGroup.children[0]);
    }
    this.myWorldBlockMeshes = [];
    this.myWorldOccupiedKeys.clear();
    this.myWorldPreviewMesh.visible = false;

    // Dispose old stage assets
    while (this.stageGroup.children.length > 0) {
      this.stageGroup.remove(this.stageGroup.children[0]);
    }
    for (const d of this.stageDisposables) {
      d.dispose();
    }
    this.stageDisposables = [];
    this.beacons = [];
    this.beaconHitMeshes = [];
    this.pickups = [];
    this.beaconCompleted = [...completedStates];

    const palette = BIOME_PALETTES[stage.biome] ?? BIOME_PALETTES.earth_crust;
    this.baseSkyColor.setHex(palette.skyColor);
    this.baseFogColor.setHex(palette.fogColor);
    this.baseFogDensity = 0.013;
    this.scene.background = new THREE.Color(palette.skyColor);
    this.scene.fog = new THREE.FogExp2(palette.fogColor, 0.013);

    // Reset player on open central path facing -Z toward beacons & landmark
    this.playerX = 0;
    this.playerY = 0;
    this.playerZ = 6.2;
    this.playerVelY = 0;
    this.playerYaw = Math.PI;
    this.isGrounded = true;

    this.partnerX = -1.6;
    this.partnerZ = 7.0;
    this.partnerYaw = Math.PI;

    this.sparkyX = 1.4;
    this.sparkyY = 1.6;
    this.sparkyZ = 6.6;

    this.timeLeft = stage.timeLimitSeconds;
    this.lastReportedSecond = stage.timeLimitSeconds;
    this.timerPaused = false;
    this.nearestBeaconIdx = null;
    this.clickTarget = null;
    this.pendingInteractBeacon = null;
    resetVoxelParticlePool(this.particlePool);
    this.syncParticlesToMesh();

    // 1. Procedural Minecraft-style Voxel Island Terrain (24x24 InstancedMesh)
    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    const bumpTex = createVoxelBumpTexture(stage.id * 17, this.maxAnisotropy);
    const groundTex = createVoxelTileTexture(
      palette.groundTop,
      palette.groundAccent,
      stage.id * 31,
      this.maxAnisotropy,
    );
    const pathTex = createVoxelTileTexture(
      palette.pathColor,
      palette.groundSide,
      stage.id * 53,
      this.maxAnisotropy,
    );
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: groundTex,
      bumpMap: bumpTex,
      bumpScale: 0.04,
      roughness: 0.85,
      metalness: 0.04,
    });
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: pathTex,
      bumpMap: bumpTex,
      bumpScale: 0.03,
      roughness: 0.78,
      metalness: 0.05,
    });

    this.stageDisposables.push(blockGeo, bumpTex, groundTex, pathTex, groundMat, pathMat);

    const gridRadius = 11; // 23x23 playable tiles (-11..11)
    const groundPositions: { x: number; z: number; isPath: boolean }[] = [];
    for (let gx = -gridRadius; gx <= gridRadius; gx++) {
      for (let gz = -gridRadius; gz <= gridRadius; gz++) {
        // Crossroads & plaza path connecting spawn -> 3 beacons -> monument
        const onCenterSpine = Math.abs(gx) <= 1 && gz >= -7 && gz <= 8;
        const onCrossPath = Math.abs(gz - 1) <= 1 && Math.abs(gx) <= 6;
        const onBeaconPad = BEACON_COORDS.some(
          ([bx, bz]) => Math.abs(gx - bx) <= 1.2 && Math.abs(gz - bz) <= 1.2,
        );
        groundPositions.push({
          x: gx,
          z: gz,
          isPath: onCenterSpine || onCrossPath || onBeaconPad,
        });
      }
    }

    const grassBlocks = groundPositions.filter((p) => !p.isPath);
    const pathBlocks = groundPositions.filter((p) => p.isPath);

    const grassInst = new THREE.InstancedMesh(blockGeo, groundMat, grassBlocks.length);
    grassInst.receiveShadow = true;
    grassBlocks.forEach((p, idx) => {
      _dummy.position.set(p.x, -0.5, p.z);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      grassInst.setMatrixAt(idx, _dummy.matrix);
    });
    grassInst.instanceMatrix.needsUpdate = true;
    grassInst.computeBoundingSphere();
    this.stageGroup.add(grassInst);

    const pathInst = new THREE.InstancedMesh(blockGeo, pathMat, pathBlocks.length);
    pathInst.receiveShadow = true;
    pathBlocks.forEach((p, idx) => {
      // Offset path slightly by 0.02? Keep same top y=0 by scaling height cleanly or placing flush at y=-0.49
      _dummy.position.set(p.x, -0.49, p.z);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      pathInst.setMatrixAt(idx, _dummy.matrix);
    });
    pathInst.instanceMatrix.needsUpdate = true;
    pathInst.computeBoundingSphere();
    this.stageGroup.add(pathInst);

    // Surrounding ocean/sky water apron extending far toward fog horizon
    const waterGeo = new THREE.PlaneGeometry(180, 180);
    const waterMat = new THREE.MeshStandardMaterial({
      color: palette.waterColor,
      roughness: 0.22,
      metalness: 0.25,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.82;
    waterMesh.receiveShadow = true;
    this.stageGroup.add(waterMesh);
    this.stageDisposables.push(waterGeo, waterMat);

    // Natural perimeter rock outcrops & voxel cliff rim (InstancedMesh)
    const rimMat = new THREE.MeshStandardMaterial({
      color: palette.cliffColor,
      roughness: 0.9,
    });
    const rimCoords: [number, number, number][] = [];
    for (let i = -12; i <= 12; i += 2) {
      if (Math.abs(i) > 2) {
        rimCoords.push([i, 0.35 + ((i * 7) & 1) * 0.4, -12.2]);
        rimCoords.push([i, 0.3 + ((i * 3) & 1) * 0.3, 12.2]);
      }
      rimCoords.push([-12.2, 0.35 + ((i * 5) & 1) * 0.45, i]);
      rimCoords.push([12.2, 0.35 + ((i * 11) & 1) * 0.45, i]);
    }
    const rimInst = new THREE.InstancedMesh(blockGeo, rimMat, rimCoords.length);
    rimInst.castShadow = true;
    rimInst.receiveShadow = true;
    rimCoords.forEach(([rx, rh, rz], idx) => {
      _dummy.position.set(rx, rh * 0.5 - 0.5, rz);
      _dummy.scale.set(1.6, rh + 1.1, 1.6);
      _dummy.updateMatrix();
      rimInst.setMatrixAt(idx, _dummy.matrix);
    });
    rimInst.instanceMatrix.needsUpdate = true;
    rimInst.computeBoundingSphere();
    this.stageGroup.add(rimInst);
    this.stageDisposables.push(rimMat);

    // Natural perimeter voxel trees (composite 4-part models)
    const treePositions: [number, number, number][] = [
      [-9.5, -8.5, 1.15],
      [9.5, -8.5, 1.1],
      [-9.8, 3.8, 0.95],
      [9.8, 3.8, 1.05],
      [-8.5, 9.2, 0.9],
      [8.5, 9.2, 0.95],
    ];
    for (const [tx, tz, sc] of treePositions) {
      const tree = buildVoxelTree(
        0x78350f,
        palette.foliagePrimary,
        palette.foliageSecondary,
        sc,
      );
      tree.position.set(tx, 0, tz);
      this.stageGroup.add(tree);
    }

    // 2. Towering Signature Topic Landmark Monument at (0, 0, -9.2)
    const landmark = buildTopicLandmark(stage.biome);
    landmark.position.set(0, 0, -9.2);
    this.stageGroup.add(landmark);

    // 3. Three Interactive Quest Beacons
    BEACON_COORDS.forEach(([bx, bz], idx) => {
      const isDone = Boolean(completedStates[idx]);
      const beacon = buildQuestBeacon(
        isDone ? '#10b981' : stage.rewardResource.accentColor,
        idx,
      );
      beacon.root.position.set(bx, 0, bz);
      this.stageGroup.add(beacon.root);
      this.beacons.push(beacon);
      this.beaconHitMeshes.push(beacon.hitMesh);
      if (isDone) {
        this.setBeaconCompleted(idx, true, false);
      }
    });

    // 4. Collectible Floating Voxel Resource Pickups (4 per stage)
    const pickupSpots: [number, number][] = [
      [-3.2, 3.6],
      [3.2, 3.6],
      [-4.8, -4.6],
      [4.8, -4.6],
    ];
    pickupSpots.forEach(([px, pz], idx) => {
      const pickupMesh = buildResourcePickup(
        stage.rewardResource.color,
        stage.rewardResource.accentColor,
      );
      pickupMesh.position.set(px, 0, pz);
      this.stageGroup.add(pickupMesh);

      const pShadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.45, 12),
        new THREE.MeshBasicMaterial({
          map: this.shadowTex,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      );
      pShadow.rotation.x = -Math.PI / 2;
      pShadow.position.set(px, 0.02, pz);
      this.stageGroup.add(pShadow);

      this.pickups.push({
        mesh: pickupMesh,
        shadow: pShadow,
        x: px,
        z: pz,
        collected: false,
        phaseOffset: idx * 1.3,
      });
    });

    this.syncActorTransforms(0);
    this.camera.position.set(this.playerX * 0.72, 8.2, this.playerZ + 10.6);
    this.camera.lookAt(this.playerX * 0.85, 1.4, this.playerZ - 2.4);
    this.updateWeatherSystem(0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  private syncParticlesToMesh() {
    let matrixDirty = false;
    let colorDirty = false;

    for (let i = 0; i < this.particlePool.capacity; i++) {
      const slot = this.particlePool.slots[i];

      if (slot.dirtyColor) {
        this.particleMesh.setColorAt(i, _color.setHex(slot.colorHex));
        slot.dirtyColor = false;
        colorDirty = true;
      }

      if (slot.needsSync) {
        if (slot.active) {
          const lifeScale = computeParticleLifeScale(slot);
          _dummy.position.set(slot.x, slot.y, slot.z);
          _dummy.rotation.set(slot.rx, slot.ry, slot.rz);
          _dummy.scale.set(
            slot.sx * lifeScale,
            slot.sy * lifeScale,
            slot.sz * lifeScale,
          );
        } else {
          _dummy.position.set(0, -50, 0);
          _dummy.rotation.set(0, 0, 0);
          _dummy.scale.setScalar(0);
        }
        _dummy.updateMatrix();
        this.particleMesh.setMatrixAt(i, _dummy.matrix);
        slot.needsSync = false;
        matrixDirty = true;
      }
    }

    if (matrixDirty) {
      this.particleMesh.instanceMatrix.needsUpdate = true;
    }
    if (colorDirty && this.particleMesh.instanceColor) {
      this.particleMesh.instanceColor.needsUpdate = true;
    }
  }

  private syncActorTransforms(dt: number) {
    const activeRefs = this.activeHero === 'bryan' ? this.bryan : this.caden;
    const partnerRefs = this.activeHero === 'bryan' ? this.caden : this.bryan;
    const activeShadow = this.activeHero === 'bryan' ? this.bryanShadow : this.cadenShadow;
    const partnerShadow = this.activeHero === 'bryan' ? this.cadenShadow : this.bryanShadow;

    activeRefs.root.visible =
      this.phase === 'title' || this.cameraViewMode === 'third_person';
    partnerRefs.root.visible = true;
    activeShadow.visible = activeRefs.root.visible;
    partnerShadow.visible = true;

    activeRefs.root.position.set(this.playerX, this.playerY, this.playerZ);
    activeRefs.root.rotation.y = this.playerYaw;
    activeShadow.position.set(this.playerX, this.playerY + 0.02, this.playerZ);
    const shadowScale = Math.max(0.55, 1 - Math.max(0, this.playerY) * 0.18);
    activeShadow.scale.setScalar(shadowScale);

    // Squash & stretch smoothly back to (1,1,1)
    activeRefs.bodyGroup.scale.x = THREE.MathUtils.damp(activeRefs.bodyGroup.scale.x, 1, 10, dt);
    activeRefs.bodyGroup.scale.y = THREE.MathUtils.damp(activeRefs.bodyGroup.scale.y, 1, 10, dt);
    activeRefs.bodyGroup.scale.z = THREE.MathUtils.damp(activeRefs.bodyGroup.scale.z, 1, 10, dt);

    // Partner follows softly behind left shoulder
    const targetPX = this.playerX - Math.cos(this.playerYaw) * 1.45 - Math.sin(this.playerYaw) * 0.9;
    const targetPZ = this.playerZ + Math.sin(this.playerYaw) * 1.45 - Math.cos(this.playerYaw) * 0.9;
    const pDx = targetPX - this.partnerX;
    const pDz = targetPZ - this.partnerZ;
    const pDist = Math.hypot(pDx, pDz);

    if (dt > 0 && pDist > 0.2) {
      const followRate = 1 - Math.exp(-4.5 * dt);
      const propX = this.partnerX + pDx * followRate;
      const propZ = this.partnerZ + pDz * followRate;
      if (this.phase === 'myworld') {
        const resolved = resolveMyWorldHorizontalCollision({
          prevX: this.partnerX,
          prevZ: this.partnerZ,
          targetX: propX,
          targetZ: propZ,
          playerY: this.partnerY,
          islandHalfExtent: this.myWorldIslandRadius - 0.45,
          blocks: this.myWorldPlacedBlocks,
          extraColliders: this.myWorldExtraColliders,
          dugDepths: this.myWorldDugDepths,
          bounds: this.myWorldBounds,
        });
        this.partnerX = resolved.x;
        this.partnerZ = resolved.z;
        this.partnerY = getMyWorldSupportHeight(
          this.partnerX,
          this.partnerY + 0.5,
          this.partnerZ,
          this.myWorldPlacedBlocks,
          this.myWorldExtraColliders,
          undefined,
          this.myWorldDugDepths,
          this.myWorldBounds,
        );
      } else {
        this.partnerX = propX;
        this.partnerZ = propZ;
        this.partnerY = 0;
      }
      this.partnerYaw = Math.atan2(pDx, pDz);
      const pSwing = Math.sin(this.elapsed * 9) * 0.45;
      partnerRefs.leftLeg.rotation.x = pSwing;
      partnerRefs.rightLeg.rotation.x = -pSwing;
      partnerRefs.leftArm.rotation.x = -pSwing * 0.7;
      partnerRefs.rightArm.rotation.x = pSwing * 0.7;
    } else {
      partnerRefs.leftLeg.rotation.x = 0;
      partnerRefs.rightLeg.rotation.x = 0;
      partnerRefs.leftArm.rotation.x = 0;
      partnerRefs.rightArm.rotation.x = 0;
    }
    partnerRefs.root.position.set(this.partnerX, this.partnerY, this.partnerZ);
    partnerRefs.root.rotation.y = this.partnerYaw;
    partnerShadow.position.set(this.partnerX, this.partnerY + 0.02, this.partnerZ);

    // Sparky companion floats & orbits playfully near right shoulder
    const sTargetX = this.playerX + Math.cos(this.elapsed * 1.4) * 1.15;
    const sTargetZ = this.playerZ + Math.sin(this.elapsed * 1.4) * 1.15;
    const sTargetY = 1.65 + Math.sin(this.elapsed * 3.4) * 0.22 + this.playerY * 0.5;
    if (dt > 0) {
      const sLerp = 1 - Math.exp(-5 * dt);
      this.sparkyX += (sTargetX - this.sparkyX) * sLerp;
      this.sparkyY += (sTargetY - this.sparkyY) * sLerp;
      this.sparkyZ += (sTargetZ - this.sparkyZ) * sLerp;
    }
    this.sparky.root.position.set(this.sparkyX, this.sparkyY, this.sparkyZ);
    this.sparky.root.rotation.y = this.playerYaw + Math.sin(this.elapsed * 2) * 0.25;
    this.sparky.tailFlame.scale.setScalar(0.85 + Math.sin(this.elapsed * 12) * 0.18);
    this.sparky.orbitSparks.forEach((sp, i) => {
      const a = this.elapsed * 3.6 + (i * Math.PI * 2) / 3;
      sp.position.set(Math.cos(a) * 0.45, Math.sin(a * 1.5) * 0.16, Math.sin(a) * 0.45);
    });

    // Flickering matchstick flame hair crests
    const flickerA = 0.92 + Math.sin(this.elapsed * 14) * 0.14;
    const flickerB = 0.92 + Math.cos(this.elapsed * 13) * 0.14;
    this.bryan.flameGroup.scale.set(1, flickerA, 1);
    this.caden.flameGroup.scale.set(1, flickerB, 1);
  }

  public setInGameMinutes(minutes: number) {
    this.inGameMinutes = normalizeInGameMinutes(minutes);
    const sched = getWeatherForInGameTime(this.inGameMinutes);
    this.rainIntensity = sched.rainTarget;
    this.updateWeatherSystem(0, 0);
  }

  private updateWeatherSystem(dt: number, clockDt = dt) {
    if (
      clockDt > 0 &&
      !this.questModalOpen &&
      (this.phase === 'title' || this.phase === 'playing' || this.phase === 'myworld')
    ) {
      this.inGameMinutes = normalizeInGameMinutes(
        this.inGameMinutes + clockDt * IN_GAME_MINUTES_PER_REAL_SECOND,
      );
    }

    const sched = getWeatherForInGameTime(this.inGameMinutes);
    if (clockDt > 0) {
      this.rainIntensity = THREE.MathUtils.damp(
        this.rainIntensity,
        sched.rainTarget,
        2.4,
        clockDt,
      );
    }

    // Golden-hour glow between 16:30 (990) and 19:30 (1170)
    const goldenDist = Math.abs(this.inGameMinutes - 1080);
    const goldenFactor = Math.max(0, 1 - goldenDist / 120) * (1 - this.rainIntensity);

    // 1. Sky & Fog atmospheric blend
    _skyScratch.copy(this.baseSkyColor);
    if (goldenFactor > 0.01) {
      _skyScratch.lerp(_goldenSkyColor, goldenFactor * 0.35);
    }
    _skyScratch.multiplyScalar(0.55 + sched.daylightFactor * 0.45);
    _skyScratch.lerp(_rainSkyColor, this.rainIntensity * 0.68);
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(_skyScratch);
    }

    if (this.scene.fog instanceof THREE.FogExp2) {
      _fogScratch.copy(this.baseFogColor);
      if (goldenFactor > 0.01) {
        _fogScratch.lerp(_goldenSkyColor, goldenFactor * 0.3);
      }
      _fogScratch.multiplyScalar(0.58 + sched.daylightFactor * 0.42);
      _fogScratch.lerp(_rainFogColor, this.rainIntensity * 0.72);
      this.scene.fog.color.copy(_fogScratch);
      this.scene.fog.density = this.baseFogDensity + this.rainIntensity * 0.009;
    }

    // 2. Sunlight & Hemisphere contrast
    this.keyLight.intensity =
      1.45 * sched.daylightFactor * (1 - this.rainIntensity * 0.46);
    this.keyLight.color
      .copy(_keySunnyColor)
      .lerp(_keyGoldenColor, goldenFactor * 0.6)
      .lerp(_keyRainColor, this.rainIntensity);

    this.hemiLight.intensity =
      0.72 * sched.daylightFactor - this.rainIntensity * 0.14;
    this.hemiLight.color.copy(_hemiSunnyColor).lerp(_hemiRainColor, this.rainIntensity);

    // 3. Sun disc arc & drifting voxel clouds (framed cleanly in upper-sky horizon)
    const sunX = Math.cos(sched.sunAngleRad) * -16;
    const sunY = 4.4 + Math.sin(sched.sunAngleRad) * 2.8;
    this.sunDiscMesh.position.set(sunX, sunY, -32);
    const sunVis =
      sunY > 2.2 ? Math.min(1, (sunY - 2.2) / 1.8) * (1 - this.rainIntensity * 0.92) : 0;
    this.sunDiscMesh.visible = sunVis > 0.04;
    this.sunDiscMat.opacity = sunVis * 0.96;

    this.cloudMat.color.copy(_cloudSunnyColor).lerp(_cloudRainColor, this.rainIntensity);
    for (const c of this.cloudSprites) {
      if (dt > 0) {
        c.x += dt * c.speed * (1 + this.rainIntensity * 0.85);
        if (c.x > 26) c.x = -26;
        c.group.position.x = c.x;
      }
    }

    // 4. Pooled 3D Voxel Rain
    const focusX = this.phase === 'title' ? 0 : this.playerX;
    const focusZ = this.phase === 'title' ? 0 : this.playerZ;
    if (this.rainIntensity > 0.03) {
      stepRainPool(this.rainPool, dt, focusX, focusZ, this.rainIntensity, 15);
      this.rainMesh.visible = true;
      this.rainMat.opacity = 0.78 * Math.min(1, this.rainIntensity * 1.15);
      const activeRatio = Math.min(1, this.rainIntensity * 1.15);
      const visibleCount = Math.floor(this.rainPool.capacity * activeRatio);
      for (let i = 0; i < this.rainPool.capacity; i++) {
        if (i < visibleCount) {
          const d = this.rainPool.drops[i];
          _dummy.position.set(d.x, d.y, d.z);
          _dummy.rotation.set(0, 0, -0.08);
          _dummy.scale.set(1, d.length, 1);
        } else {
          _dummy.position.set(0, -50, 0);
          _dummy.rotation.set(0, 0, 0);
          _dummy.scale.setScalar(0);
        }
        _dummy.updateMatrix();
        this.rainMesh.setMatrixAt(i, _dummy.matrix);
      }
      this.rainMesh.instanceMatrix.needsUpdate = true;
    } else {
      this.rainMesh.visible = false;
    }

    const emitKey = `${sched.condition}|${sched.formattedTime}`;
    if (emitKey !== this.lastWeatherEmitKey) {
      this.lastWeatherEmitKey = emitKey;
      this.callbacks.onWeatherChange?.({
        condition: sched.condition,
        formattedTime: sched.formattedTime,
        label: sched.label,
      });
    }
  }

  private updateSimulation(dt: number, clockDt = dt) {
    this.updateWeatherSystem(dt, clockDt);

    // Animate beacons & pickups even during title flyover
    this.beacons.forEach((b, idx) => {
      b.crystal.rotation.y += dt * 1.6;
      b.crystal.position.y = 1.65 + Math.sin(this.elapsed * 2.6 + idx) * 0.14;
      b.ring.scale.setScalar(1 + Math.sin(this.elapsed * 3.2 + idx) * 0.06);
    });

    this.pickups.forEach((p) => {
      if (p.collected) return;
      p.mesh.rotation.y += dt * 2.1;
      p.mesh.position.y = Math.sin(this.elapsed * 2.8 + p.phaseOffset) * 0.15;
    });

    // Update pooled voxel particles & confetti
    if (stepVoxelParticles(this.particlePool, dt, this.elapsed)) {
      this.syncParticlesToMesh();
    }

    if (this.phase === 'title') {
      // Live world orbital spline camera pan framed to keep left sky open for Title lockup
      const panAngle = 0.45 + this.elapsed * 0.22;
      _camGoal.set(
        Math.sin(panAngle) * 14.5,
        7.6 + Math.sin(this.elapsed * 0.5) * 0.6,
        Math.cos(panAngle) * 14.5,
      );
      this.camera.position.copy(_camGoal);
      this.camera.lookAt(-2.2, 1.8, -1.0);
      this.syncActorTransforms(dt);
      return;
    }

    if (this.phase === 'myworld') {
      this.updateMyWorldSimulation(dt);
      return;
    }

    if (this.phase !== 'playing') {
      this.syncActorTransforms(0);
      return;
    }

    // Countdown timer (paused while answering a Quest modal or during victory celebration)
    if (!this.questModalOpen && !this.timerPaused) {
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      const secInt = Math.ceil(this.timeLeft);
      if (secInt !== this.lastReportedSecond) {
        this.lastReportedSecond = secInt;
        this.callbacks.onTimerTick(secInt);
      }
      if (this.timeLeft <= 0) {
        this.callbacks.onTimeExpired();
        return;
      }
    }

    // Player Movement (when quest modal is closed)
    if (!this.questModalOpen) {
      const activeRefs = this.activeHero === 'bryan' ? this.bryan : this.caden;
      let nx = 0;
      let nz = 0;
      let isMoving = false;

      if (this.cameraViewMode === 'first_person') {
        const turnSpeed = 2.4;
        if (this.heldKeys.has('ArrowLeft') || this.heldKeys.has('KeyQ')) {
          this.playerYaw += turnSpeed * dt;
        }
        if (this.heldKeys.has('ArrowRight') || this.heldKeys.has('KeyR')) {
          this.playerYaw -= turnSpeed * dt;
        }
        const fwd =
          (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp') ? 1 : 0) -
          (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown') ? 1 : 0);
        const strafe =
          (this.heldKeys.has('KeyD') ? 1 : 0) - (this.heldKeys.has('KeyA') ? 1 : 0);
        const fpVec = computeFirstPersonMoveVector(fwd, strafe, this.playerYaw);
        if (Math.hypot(fpVec.nx, fpVec.nz) > 0.01) {
          nx = fpVec.nx;
          nz = fpVec.nz;
          isMoving = true;
          this.clickTarget = null;
        }
      } else {
        let moveX = 0;
        let moveZ = 0;
        if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) moveZ -= 1;
        if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) moveZ += 1;
        if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) moveX -= 1;
        if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) moveX += 1;

        if (moveX === 0 && moveZ === 0 && this.clickTarget) {
          const dx = this.clickTarget.x - this.playerX;
          const dz = this.clickTarget.z - this.playerZ;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.35) {
            this.clickTarget = null;
            if (this.pendingInteractBeacon !== null) {
              const idx = this.pendingInteractBeacon;
              this.pendingInteractBeacon = null;
              if (!this.beaconCompleted[idx]) {
                this.callbacks.onInteractBeacon(idx);
              }
            }
          } else {
            moveX = dx / dist;
            moveZ = dz / dist;
          }
        }

        const moveLen = Math.hypot(moveX, moveZ);
        if (moveLen > 0.01) {
          nx = moveX / moveLen;
          nz = moveZ / moveLen;
          isMoving = true;
        }
      }

      if (isMoving) {
        const speed = 7.8;
        const nextPos = clampPlayerPosition(
          this.playerX + nx * speed * dt,
          this.playerZ + nz * speed * dt,
          ARENA_HALF_EXTENT,
        );
        const stepDist = Math.hypot(nextPos.x - this.playerX, nextPos.z - this.playerZ);
        this.playerX = nextPos.x;
        this.playerZ = nextPos.z;
        this.walkDistance += stepDist;

        if (this.cameraViewMode === 'third_person') {
          const targetYaw = Math.atan2(nx, nz);
          let diff = targetYaw - this.playerYaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.playerYaw += diff * (1 - Math.exp(-14 * dt));
        }

        // Gait synced to distance traveled
        const swing = Math.sin(this.walkDistance * 3.8) * 0.65;
        activeRefs.leftLeg.rotation.x = swing;
        activeRefs.rightLeg.rotation.x = -swing;
        activeRefs.leftArm.rotation.x = -swing * 0.75;
        activeRefs.rightArm.rotation.x = swing * 0.75;
      } else {
        activeRefs.leftLeg.rotation.x = THREE.MathUtils.damp(activeRefs.leftLeg.rotation.x, 0, 12, dt);
        activeRefs.rightLeg.rotation.x = THREE.MathUtils.damp(activeRefs.rightLeg.rotation.x, 0, 12, dt);
        activeRefs.leftArm.rotation.x = THREE.MathUtils.damp(activeRefs.leftArm.rotation.x, 0, 12, dt);
        activeRefs.rightArm.rotation.x = THREE.MathUtils.damp(activeRefs.rightArm.rotation.x, 0, 12, dt);
      }

      // Jump & Gravity
      if (this.jumpQueued && this.isGrounded) {
        this.playerVelY = 7.4;
        this.isGrounded = false;
        activeRefs.bodyGroup.scale.set(0.86, 1.18, 0.86);
        emitVoxelBurst(this.particlePool, {
          x: this.playerX,
          y: 0.2,
          z: this.playerZ,
          colorHex: 0xfbbf24,
          count: 6,
        });
        soundFX.playJump();
      }
      this.jumpQueued = false;

      if (!this.isGrounded) {
        this.playerVelY -= 21 * dt;
        this.playerY += this.playerVelY * dt;
        if (this.playerY <= 0) {
          this.playerY = 0;
          this.playerVelY = 0;
          this.isGrounded = true;
          activeRefs.bodyGroup.scale.set(1.18, 0.82, 1.18);
        }
      }

      // Check Collectible Pickups
      for (const p of this.pickups) {
        if (p.collected) continue;
        if (Math.hypot(p.x - this.playerX, p.z - this.playerZ) <= 1.2) {
          p.collected = true;
          p.mesh.visible = false;
          p.shadow.visible = false;
          emitVoxelBurst(this.particlePool, {
            x: p.x,
            y: 0.9,
            z: p.z,
            colorHex: 0xfacc15,
            count: 10,
          });
          soundFX.playPickup();
          this.callbacks.onCollectPickup();
        }
      }

      // Check Beacon Proximity
      const beaconSpecs = BEACON_COORDS.map(([x, z], index) => ({
        index,
        x,
        z,
        completed: this.beaconCompleted[index],
      }));
      const near = findNearestActiveBeacon(this.playerX, this.playerZ, beaconSpecs, 3.05);
      const nearIdx = near ? near.index : null;
      if (nearIdx !== this.nearestBeaconIdx) {
        this.nearestBeaconIdx = nearIdx;
        this.callbacks.onNearbyBeaconChange(nearIdx);
      }

      if (this.interactQueued && this.nearestBeaconIdx !== null) {
        soundFX.playBeaconOpen();
        this.callbacks.onInteractBeacon(this.nearestBeaconIdx);
      }
      this.interactQueued = false;
    }

    if (this.cameraViewMode === 'first_person') {
      const pose = computeFirstPersonCameraPose(
        this.playerX,
        this.playerY,
        this.playerZ,
        this.playerYaw,
        this.firstPersonPitch,
      );
      this.camera.position.set(pose.eyeX, pose.eyeY, pose.eyeZ);
      if (this.cameraTrauma > 0.001) {
        const shake = this.cameraTrauma * this.cameraTrauma * 0.2;
        this.camera.position.x += (Math.random() - 0.5) * shake;
        this.camera.position.y += (Math.random() - 0.5) * shake;
        this.cameraTrauma = Math.max(0, this.cameraTrauma - dt * 1.8);
      }
      this.camera.lookAt(pose.lookX, pose.lookY, pose.lookZ);
    } else {
      // Exponentially damped follow camera + trauma shake
      _camGoal.set(this.playerX * 0.72, 8.2, this.playerZ + 10.6);
      _lookGoal.set(this.playerX * 0.85, 1.4, this.playerZ - 2.4);

      const camFactor = 1 - Math.exp(-6.5 * dt);
      this.camera.position.lerp(_camGoal, camFactor);
      if (this.cameraTrauma > 0.001) {
        const shake = this.cameraTrauma * this.cameraTrauma * 0.35;
        this.camera.position.x += (Math.random() - 0.5) * shake;
        this.camera.position.y += (Math.random() - 0.5) * shake;
        this.cameraTrauma = Math.max(0, this.cameraTrauma - dt * 1.8);
      }
      this.camera.lookAt(_lookGoal);
    }

    this.container.dataset.cameraView = this.cameraViewMode;
    this.syncActorTransforms(dt);
  }

  private updateMyWorldSimulation(dt: number) {
    // Animate unlocked Topic Habitat living things, animals, plants, cells & props
    for (const prop of this.myWorldFloatingProps) {
      const t = this.elapsed + prop.phase;
      if (prop.mode === 'spin') {
        prop.mesh.rotation.y += dt * 1.65;
      } else if (prop.mode === 'hop') {
        prop.mesh.position.y = prop.baseY + Math.abs(Math.sin(t * 3.1)) * 0.34;
        prop.mesh.rotation.y = Math.sin(t * 1.1) * 0.35;
      } else if (prop.mode === 'waddle') {
        prop.mesh.rotation.z = Math.sin(t * 4.2) * 0.14;
        prop.mesh.rotation.y = Math.sin(t * 0.9) * 0.4;
      } else if (prop.mode === 'sway') {
        prop.mesh.rotation.z = Math.sin(t * 2.2) * 0.1;
      } else if (prop.mode === 'orbit') {
        prop.mesh.position.set(
          prop.baseX + Math.cos(t * 1.9) * 0.65,
          prop.baseY + Math.sin(t * 3.4) * 0.14,
          prop.baseZ + Math.sin(t * 1.9) * 0.65,
        );
        prop.mesh.rotation.y = -t * 1.9;
      } else {
        prop.mesh.rotation.y += dt * 1.5;
        prop.mesh.position.y = prop.baseY + Math.sin(t * 2.6) * 0.14;
      }
    }

    // Smoothly damp orbit yaw
    const yawDiff = this.myWorldCameraYawTarget - this.myWorldCameraYaw;
    this.myWorldCameraYaw += yawDiff * (1 - Math.exp(-9 * dt));

    if (!this.questModalOpen) {
      const activeRefs = this.activeHero === 'bryan' ? this.bryan : this.caden;
      let nx = 0;
      let nz = 0;
      let isMoving = false;

      if (this.cameraViewMode === 'first_person') {
        const turnSpeed = 2.4;
        if (this.heldKeys.has('ArrowLeft') || this.heldKeys.has('KeyQ')) {
          this.playerYaw += turnSpeed * dt;
        }
        if (this.heldKeys.has('ArrowRight') || this.heldKeys.has('KeyR')) {
          this.playerYaw -= turnSpeed * dt;
        }
        const fwd =
          (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp') ? 1 : 0) -
          (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown') ? 1 : 0);
        const strafe =
          (this.heldKeys.has('KeyD') ? 1 : 0) - (this.heldKeys.has('KeyA') ? 1 : 0);
        const fpVec = computeFirstPersonMoveVector(fwd, strafe, this.playerYaw);
        if (Math.hypot(fpVec.nx, fpVec.nz) > 0.01) {
          nx = fpVec.nx;
          nz = fpVec.nz;
          isMoving = true;
        }
      } else {
        let rawX = 0;
        let rawZ = 0;
        if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) rawZ -= 1;
        if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) rawZ += 1;
        if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) rawX -= 1;
        if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) rawX += 1;

        const moveLen = Math.hypot(rawX, rawZ);
        if (moveLen > 0.01) {
          const cos = Math.cos(this.myWorldCameraYaw);
          const sin = Math.sin(this.myWorldCameraYaw);
          const worldX = rawX * cos + rawZ * sin;
          const worldZ = -rawX * sin + rawZ * cos;
          const wLen = Math.hypot(worldX, worldZ) || 1;
          nx = worldX / wLen;
          nz = worldZ / wLen;
          isMoving = true;
        }
      }

      if (isMoving) {
        const speed = 7.6;
        const nextPos = resolveMyWorldHorizontalCollision({
          prevX: this.playerX,
          prevZ: this.playerZ,
          targetX: this.playerX + nx * speed * dt,
          targetZ: this.playerZ + nz * speed * dt,
          playerY: this.playerY,
          islandHalfExtent: this.myWorldIslandRadius - 0.45,
          blocks: this.myWorldPlacedBlocks,
          extraColliders: this.myWorldExtraColliders,
          dugDepths: this.myWorldDugDepths,
          bounds: this.myWorldBounds,
        });
        const stepDist = Math.hypot(nextPos.x - this.playerX, nextPos.z - this.playerZ);
        this.playerX = nextPos.x;
        this.playerZ = nextPos.z;
        this.walkDistance += stepDist;

        if (this.cameraViewMode === 'third_person') {
          const targetYaw = Math.atan2(nx, nz);
          let diff = targetYaw - this.playerYaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.playerYaw += diff * (1 - Math.exp(-14 * dt));
        }

        const swing = Math.sin(this.walkDistance * 3.8) * 0.65;
        activeRefs.leftLeg.rotation.x = swing;
        activeRefs.rightLeg.rotation.x = -swing;
        activeRefs.leftArm.rotation.x = -swing * 0.75;
        activeRefs.rightArm.rotation.x = swing * 0.75;
      } else {
        activeRefs.leftLeg.rotation.x = THREE.MathUtils.damp(activeRefs.leftLeg.rotation.x, 0, 12, dt);
        activeRefs.rightLeg.rotation.x = THREE.MathUtils.damp(activeRefs.rightLeg.rotation.x, 0, 12, dt);
        activeRefs.leftArm.rotation.x = THREE.MathUtils.damp(activeRefs.leftArm.rotation.x, 0, 12, dt);
        activeRefs.rightArm.rotation.x = THREE.MathUtils.damp(activeRefs.rightArm.rotation.x, 0, 12, dt);
      }

      const supportY = getMyWorldSupportHeight(
        this.playerX,
        this.playerY,
        this.playerZ,
        this.myWorldPlacedBlocks,
        this.myWorldExtraColliders,
        undefined,
        this.myWorldDugDepths,
        this.myWorldBounds,
      );

      if (this.jumpQueued && this.isGrounded) {
        this.playerVelY = 7.8;
        this.isGrounded = false;
        activeRefs.bodyGroup.scale.set(0.86, 1.18, 0.86);
        emitVoxelBurst(this.particlePool, {
          x: this.playerX,
          y: this.playerY + 0.2,
          z: this.playerZ,
          colorHex: 0xfbbf24,
          count: 6,
        });
        soundFX.playJump();
      }
      this.jumpQueued = false;

      if (this.isGrounded && this.playerY > supportY + 0.02) {
        // Stepped off a block top or pit edge: transition cleanly into fall
        this.isGrounded = false;
        this.playerVelY = 0;
      }

      if (!this.isGrounded) {
        this.playerVelY -= 21 * dt;
        this.playerY += this.playerVelY * dt;
        const nextSupportY = getMyWorldSupportHeight(
          this.playerX,
          this.playerY,
          this.playerZ,
          this.myWorldPlacedBlocks,
          this.myWorldExtraColliders,
          undefined,
          this.myWorldDugDepths,
          this.myWorldBounds,
        );
        if (this.playerY <= nextSupportY && this.playerVelY <= 0) {
          this.playerY = nextSupportY;
          this.playerVelY = 0;
          this.isGrounded = true;
          activeRefs.bodyGroup.scale.set(1.18, 0.82, 1.18);
        }
      }
    }

    if (this.cameraViewMode === 'first_person') {
      const pose = computeFirstPersonCameraPose(
        this.playerX,
        this.playerY,
        this.playerZ,
        this.playerYaw,
        this.firstPersonPitch,
      );
      this.camera.position.set(pose.eyeX, pose.eyeY, pose.eyeZ);
      this.camera.lookAt(pose.lookX, pose.lookY, pose.lookZ);

      if (!this.questModalOpen) {
        const aimed = this.computeMyWorldRaycastNdc(0, 0, this.myWorldTool, 7.5);
        this.updateMyWorldPreviewFromTarget(aimed);
      }
    } else {
      // Elevated rotatable sandbox camera scaled smoothly without erasing visible island growth
      const extraSpan = Math.max(0, this.myWorldBounds.maxX - 6);
      const dist = 14.4 + Math.min(6.5, extraSpan * 0.24);
      const camHeight = 9.2 + Math.min(3.5, extraSpan * 0.14);
      const focusX = this.playerX * 0.45;
      const focusZ = this.playerZ * 0.45 - 1.2;
      _camGoal.set(
        focusX + Math.sin(this.myWorldCameraYaw) * dist,
        camHeight,
        focusZ + Math.cos(this.myWorldCameraYaw) * dist,
      );
      _lookGoal.set(focusX, 1.85, focusZ);
      const camFactor = 1 - Math.exp(-6.5 * dt);
      this.camera.position.lerp(_camGoal, camFactor);
      this.camera.lookAt(_lookGoal);
    }

    this.container.dataset.playerPos = `${this.playerX.toFixed(2)},${this.playerY.toFixed(2)},${this.playerZ.toFixed(2)}`;
    this.container.dataset.cameraView = this.cameraViewMode;
    this.syncActorTransforms(dt);
  }

  private tick = () => {
    if (this.disposed) return;

    const nowMs = performance.now();
    const rawDt = Math.max(0.001, (nowMs - this.lastTickMs) / 1000);
    this.lastTickMs = nowMs;
    const dt = Math.min(rawDt, this.isSoftwareGl ? 0.12 : 0.05);
    const clockDt = Math.min(rawDt, 1.0);
    this.elapsed += dt;

    this.updateSimulation(dt, clockDt);
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  public dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.unbindEvents();
    for (const d of this.stageDisposables) {
      d.dispose();
    }
    this.myWorldMatCache.forEach((b) => {
      b.main.dispose();
      b.accent.dispose();
      b.tex.dispose();
    });
    this.myWorldMatCache.clear();
    if (this.myWorldTerrainMats) {
      this.myWorldTerrainMats.plaza.dispose();
      this.myWorldTerrainMats.subsoil.dispose();
      this.myWorldTerrainMats.bedrock.dispose();
      this.myWorldTerrainMats.textures.forEach((t) => t.dispose());
      this.myWorldTerrainMats = null;
    }
    while (this.myWorldTerrainGroup.children.length > 0) {
      const child = this.myWorldTerrainGroup.children[0] as THREE.InstancedMesh;
      this.myWorldTerrainGroup.remove(child);
      child.dispose?.();
    }
    this.myWorldBlockGeo.dispose();
    this.myWorldCapGeo.dispose();
    this.myWorldEdgeGeo.dispose();
    this.myWorldEdgeMat.dispose();
    this.myWorldPreviewMat.dispose();
    this.myWorldPreviewMesh.geometry.dispose();
    this.particleGeo.dispose();
    this.particleMat.dispose();
    this.rainGeo.dispose();
    this.rainMat.dispose();
    this.sunDiscGeo.dispose();
    this.sunDiscMat.dispose();
    this.cloudMat.dispose();
    for (const g of this.cloudDisposables) {
      g.dispose();
    }
    this.shadowTex.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
