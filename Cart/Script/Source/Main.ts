namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  let graph: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let cart: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  let camera: ƒ.Node = new ƒ.Node("Cam1")
  //let mult: number
  //let body: ƒ.ComponentRigidbody;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 8, ƒ.CONTROL_TYPE.PROPORTIONAL);
  //ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  //ctrForward.setDelay(50);
  let cartrb: ƒ.ComponentRigidbody;
  //let terrainpos: ƒ.Vector3;
  //let federconstant: number = 85;
  let dist: number = 1
  
  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();

    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-25T11:20:14.002Z|22521"];
    let cmpMeshTerrain: ƒ.ComponentMesh = graph.getChildrenByName("Map")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;
    cart = graph.getChildrenByName("Agent")[0];
    cartrb = cart.getComponent(ƒ.ComponentRigidbody);
    camera.addComponent(new ƒ.ComponentCamera)
    camera.addComponent(new ƒ.ComponentTransform)
    camera.getComponent(ƒ.ComponentCamera).mtxPivot.translation = new ƒ.Vector3(0, 12, -22)
    camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(25, 0, 0)
    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    //graph.getChildrenByName("Agent")[0].addChild(cameraNode);
    graph.addChild(camera);
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
    cartrb.mass = 2;
    cartrb.effectGravity = 0;
    cartrb.dampTranslation = 10;
    cartrb.dampRotation = 10
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    ƒ.Physics.world.simulate();  // if physics is included and used
    //camera.mtxLocal.translation = cart.mtxWorld.translation;
    //camera.mtxLocal.rotation = new ƒ.Vector3(0,)
    let forceNodes: ƒ.Node[] = cart.getChildren();
    camera.mtxLocal.translation = new ƒ.Vector3(cart.mtxLocal.translation.x, 8, cart.mtxLocal.translation.z - 12)
    //camera.mtxLocal.rotation = new ƒ.Vector3(25,cart.mtxWorld.rotation.y,0)
    //camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(0,cart.mtxWorld.rotation.y,0)
    //let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    //cartrb.mass = 1000;
    

    //console.log(force)
    //let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
    //terrainpos = terrainInfo.position;

    //cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);


    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    cartrb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    //cartrb.applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));
    cartrb.addVelocity(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()))
    /*let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    cart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    cart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
    cart.mtxLocal.translation = terrainInfo.position;
    cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
    */
    placeCameraOnCart();
    viewport.draw();
    //let forceNodes: ƒ.Node[] = cart.getChildren();
    //let force2: number = forcevec.y;
    for (let PointForce of forceNodes) {
      let posForce: ƒ.Vector3 = PointForce.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      
      //let height: number = posForce.y - terrainInfo.position.y;
      //let posForce: ƒ.Vector3 = PointForce.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      let pos1: number = PointForce.getComponent(ƒ.ComponentMesh).mtxWorld.translation.y;
      let pos2: number = terrainInfo.position.y;
      dist = pos1 - pos2;
      //console.log(pos1,pos2,dist)
      
      if (dist > 1) {

          dist = 1
      }
      
     
      dist = dist - 1;
      
      //let forcevec = new ƒ.Vector3(0, -cartrb.mass * 4 * dist, 0);
      //let vek: ƒ.Vector3 = new ƒ.Vector3(0,cartrb.mass * 4 * dist,0 )
      let forcevec: ƒ.Vector3 = new ƒ.Vector3(0,cartrb.mass  * dist*16/(-1),0);
      let force: ƒ.Vector3 = new ƒ.Vector3(0,cartrb.mass* (-10)/1,0);
      cartrb.applyForceAtPoint(force, posForce);
      //cartrb.applyForceAtPoint(new ƒ.Vector3(0,-50,0),cart.getChildrenByName("PointForce1")[0].mtxWorld.translation)
      //console.log(cart.mtxWorld.translation.y)
      cartrb.applyForceAtPoint(forcevec, posForce);
      console.log("pos: "+ posForce+ "forcedown: " + force + "forceup: " + forcevec + "dist: "+dist)
      //console.log(force, forcevec)
    }
    console.log("next")
    
    //cartrb.applyForce(new ƒ.Vector3(0,-cartrb.mass*85*dist,0))

    //ƒ.AudioManager.default.update();
  }
  function placeCameraOnCart(): void {
    camera.mtxLocal.mutate({
      translation: cart.mtxWorld.translation,
      rotation: new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0)
    });
  }

}