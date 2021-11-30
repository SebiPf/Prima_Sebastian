namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let Agent: ƒ.Node;
  let Map: ƒ.Node
  //let graph: ƒ.Graph
  //let cmpAgent: ƒ.ComponentRigidbody;
  //let cmpMap: ƒ.ComponentRigidbody;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    //ƒ.PhysicsSettings.defaultRestitution = 0.3;
    //ƒ.Physics.settings.defaultFriction = 0.8;
    
    Agent = viewport.getBranch().getChildrenByName("Agent")[0];
    Map = viewport.getBranch().getChildrenByName("Map")[0];
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
    //ƒ.Physics.world.simulate();  // if physics is included and used
    let speed: number = 5;
    let speedjump: number = 10;
    let rotate: number = 5;
    let forward: ƒ.Vector3;
    forward = Agent.mtxWorld.getZ();
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
      Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(forward, speed));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
    Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(forward, - speed));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
    Agent.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(rotate));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    Agent.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(-rotate));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]))
    Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(Agent.mtxWorld.getY(), speedjump));

    ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);

    viewport.draw();
    //ƒ.AudioManager.default.update();
  }
}