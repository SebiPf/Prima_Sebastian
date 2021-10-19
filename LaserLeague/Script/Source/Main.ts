namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let transform: ƒ.Matrix4x4;
  let transform1: ƒ.Matrix4x4;
  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    let graph: ƒ.Node = viewport.getBranch();
    let laserbase: ƒ.Node = graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0];
    let agent: ƒ.Node = graph.getChildrenByName("Agent")[0];
    transform = laserbase.getComponent(ƒ.ComponentTransform).mtxLocal;
    transform1 = agent.getComponent(ƒ.ComponentTransform).mtxLocal;
  }
  document.addEventListener("keydown", hndKeypress);
  async function hndKeypress(_event: KeyboardEvent): Promise<void> {
    switch (_event.code) {
      case ƒ.KEYBOARD_CODE.W:
        transform1.translateZ(-0.5)
        break;
      case ƒ.KEYBOARD_CODE.S: 
      transform1.translateZ(0.5)       
        break;
      case ƒ.KEYBOARD_CODE.A:
        transform1.translateX(-0.5)
        break;
      case ƒ.KEYBOARD_CODE.D:
        transform1.translateX(0.5)
        break;
    }

  }
  function update(_event: Event): void {
    
    let x = transform1.translation.x;
    let z = transform1.translation.z;
    //console.log("testttttt " + x)
    if(x > 9){
      transform1.translateX(-18.5)
    }
    if(x < -9){
      transform1.translateX(18.5)
    }
    if(z > 6.5){
      transform1.translateZ(-13.5)
    }
    if(z < -6.5){
      transform1.translateZ(13.5)
    }
    // ƒ.Physics.world.simulate();  // if physics is included and used
    
    
    //let lasercomp = laserbase.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(90);
    
    //console.log("output: " + graph);
    
    transform.rotateY(5);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}