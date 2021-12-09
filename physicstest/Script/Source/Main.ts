namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let Agent: ƒ.Node;
  //let Map: ƒ.Node
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  //let graph: ƒ.Graph
  //let cmpAgent: ƒ.ComponentRigidbody;
  //let cmpMap: ƒ.ComponentRigidbody;
  let Agentrb: ƒ.ComponentRigidbody;
  //let cmpBall: ƒ.ComponentRigidbody;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 20, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    //ƒ.PhysicsSettings.defaultRestitution = 0.3;
    //ƒ.Physics.settings.defaultFriction = 0.8;

    Agent = viewport.getBranch().getChildrenByName("Agent")[0];
    viewport.camera.mtxPivot.translateY(100)
    viewport.camera.mtxPivot.rotateX(90)
    //Map = viewport.getBranch().getChildrenByName("Map")[0];
    let cmpMeshTerrain: ƒ.ComponentMesh = viewport.getBranch().getChildrenByName("Map")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;

    Agentrb = Agent.getComponent(ƒ.ComponentRigidbody);
    //Map = new ƒ.

    //cmpAgent = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
    //cmpAgent.restitution = 0.5;
    //cmpAgent.friction = 1;
    //cmpMap = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
    //Agent.addComponent(cmpAgent);
    //Map.addComponent(cmpMap);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    ƒ.Physics.world.simulate();  // if physics is included and used


    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);

    ctrTurn.setInput(turn);

    Agentrb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));

    let terrainInfo1: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x + 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + 1), mtxTerrain);
    let terrainInfo2: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x + 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + -1), mtxTerrain);
    let terrainInfo3: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x - 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + 1), mtxTerrain);
    let terrainInfo4: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x - 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + -1), mtxTerrain);
    //Agent.mtxLocal.translation = terrainInfo1.position;
    //Agent.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo1.position, Agent.mtxLocal.getZ()), terrainInfo1.normal);

    if (Agent.mtxWorld.translation.y - terrainInfo1.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo2.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo3.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo4.position.y > 1) {
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
    }
    else if (Agent.mtxWorld.translation.y - terrainInfo1.position.y > 1) {
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
    }
    else if (Agent.mtxWorld.translation.y - terrainInfo2.position.y > 1) {
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
    }
    else if (Agent.mtxWorld.translation.y - terrainInfo3.position.y > 1) {
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
    }
    else if (Agent.mtxWorld.translation.y - terrainInfo4.position.y > 1) {
      Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
    }

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    Agentrb.applyForce(ƒ.Vector3.SCALE(Agent.mtxLocal.getX(), ctrForward.getOutput()));
    viewport.draw();
    //ƒ.AudioManager.default.update();
  }
}