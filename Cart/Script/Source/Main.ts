namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  let graph: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let cart: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  let camera: ƒ.Node = new ƒ.Node("Cam1")
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 20, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 300, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);
  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();

    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-25T11:20:14.002Z|22521"];
    let cmpMeshTerrain: ƒ.ComponentMesh = graph.getChildrenByName("Map")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;
    cart = graph.getChildrenByName("Agent")[0];

    camera.addComponent(new ƒ.ComponentCamera)
    camera.addComponent(new ƒ.ComponentTransform)
    camera.mtxLocal.translation = new ƒ.Vector3(0,8,-12)
    camera.mtxLocal.rotation = new ƒ.Vector3(25,0,0)
    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    //graph.getChildrenByName("Agent")[0].addChild(cameraNode);
    graph.addChild(camera);
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    //ƒ.Physics.world.simulate();  // if physics is included and used
    //camera.mtxLocal.translation = cart.mtxWorld.translation;
    //camera.mtxLocal.rotation = new ƒ.Vector3(0,)
    camera.mtxLocal.translation = new ƒ.Vector3(cart.mtxLocal.translation.x,8,cart.mtxLocal.translation.z-12)
    //camera.mtxLocal.rotation = new ƒ.Vector3(25,cart.mtxWorld.rotation.y,0)
    //camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(0,cart.mtxWorld.rotation.y,0)
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    cart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    cart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
    cart.mtxLocal.translation = terrainInfo.position;
    cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);

    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

}