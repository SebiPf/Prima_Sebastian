namespace Maba {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  let Main: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let camera: ƒ.Node 
  let base: Base;
  //let ligth: ƒ.Node;

  window.addEventListener("load", start);
  
  async function start(_enent: Event): Promise<void> {
    
    camera = new ƒ.Node("Cam");
    await ƒ.Project.loadResourcesFromHTML();
    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    let canvas= document.querySelector("canvas");
    Main = <ƒ.Graph>ƒ.Project.resources["Graph|2021-12-01T18:28:10.150Z|79155"];
    Main.addChild(camera);
    camera.addComponent(new ƒ.ComponentCamera)
    camera.addComponent(new ƒ.ComponentTransform)
    //ligth.addComponent(new ƒ.Light(new ƒ.Color(0,0,0,1)))
    let cmpCamera = camera.getComponent(ƒ.ComponentCamera)
    //Main.addComponent(cmpCamera);
    
    cmpCamera.mtxPivot.translation = new ƒ.Vector3(-5,0,0)
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0,0,0)
    
    viewport = new ƒ.Viewport();
    
    base = new Base();
    Main.addChild(base)
    base.mtxLocal.scaleX(10)
    viewport.initialize("Viewport", Main, cmpCamera, canvas);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    base.mtxLocal.translate(new ƒ.Vector3(1,1,1))
    console.log("test")
    viewport.draw();
    //ƒ.AudioManager.default.update();
  }
}