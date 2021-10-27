namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  //let speedagent: number = 1;
  
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);
  
  //let rotation: ƒ.Matrix4x4;
  let rotatingspeed: number = 360;
  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  let laserbase: ƒ.Node;
  let forward: ƒ.Control = new ƒ.Control("Forward", 10 , ƒ.CONTROL_TYPE.PROPORTIONAL)
  forward.setDelay(300);
  let agenttransform: ƒ.Matrix4x4;
  let copy: ƒ.GraphInstance;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    
    
    
    
    
    let graph: ƒ.Node = viewport.getBranch();
    laserbase = graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0];
    agent= graph.getChildrenByName("Agent")[0];
    transform = laserbase.getComponent(ƒ.ComponentTransform).mtxLocal;
    //rotation = graph.getChildrenByName("LaserBeam")[0].mtxLocal;
    agenttransform = agent.getComponent(ƒ.ComponentTransform).mtxLocal;

    let graphlaser: ƒ.Graph = await ƒ.Project.registerAsGraph(laserbase, false)
    copy = await ƒ.Project.createGraphInstance(graphlaser);
    graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0].addChild(copy);
    //copy.addComponent( new ƒ.ComponentTransform);
    copy.mtxLocal.translateX(5);



    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
  }
  /* document.addEventListener("keydown", hndKeypress);
  async function hndKeypress(_event: KeyboardEvent): Promise<void> {
    switch (_event.code) {
      case ƒ.KEYBOARD_CODE.W:
        transform1.translateZ(-0.1)
        break;
      case ƒ.KEYBOARD_CODE.S: 
      transform1.translateZ(0.1)       
        break;
      case ƒ.KEYBOARD_CODE.A:
        transform1.translateX(-0.1)
        break;
      case ƒ.KEYBOARD_CODE.D:
        transform1.translateX(0.1)
        break;
    }

  } */
  function update(_event: Event): void {
    
    let deltatime: number = ƒ.Loop.timeFrameReal / 1000;
    let turnagent: number = 360;
    
    transform.rotateY(rotatingspeed * deltatime);
    let value: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );
    forward.setInput(value * deltatime);
    agent.mtxLocal.translateX(forward.getOutput())
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT]) == true){
        agenttransform.rotateY(turnagent * deltatime)
    
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D,ƒ.KEYBOARD_CODE.ARROW_RIGHT]) == true){
          agenttransform.rotateY(-turnagent * deltatime)
      
          }


     /* let x = agenttransform.translation.x;

    let z = agenttransform.translation.z;
    //console.log("testttttt " + x)
    if(x > 9){
      agenttransform.translateX(-18.5)
    }
    if(x < -9){
      agenttransform.translateX(18.5)
    }
    if(z > 6.5){
      agenttransform.translateZ(-13.5)
    }
    if(z < -6.5){
      agenttransform.translateZ(13.5)
    }  */
    // ƒ.Physics.world.simulate();  // if physics is included and used
    
    //console.log("output: " + graph);
    
    checkCollision();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }


  function checkCollision(): void {
    let beam: ƒ.Node = laserbase.getChildren()[0];
    let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
    //console.log("check: " + posLocal.toString());
    let radius: number = 0.5;
    
    console.log(agenttransform.translation.x);
    if(posLocal.x > (-5 - radius)&& posLocal.x < (0+radius) && posLocal.z < (0.25+radius)   && posLocal.z > (-0.25- radius)  ){
      console.log("Collision ");
      //agenttransform.translation.x = 5;
      agent.mtxLocal.translation = ƒ.Vector3.X(5);
      
    }
    if(posLocal.z > (-2.5 - radius)&& posLocal.z < (2.5+radius) && posLocal.x < (0.25+radius)   && posLocal.x > (-0.25- radius)  ){
      console.log("Collision ");
      //agenttransform.translation.x = 5;
      agent.mtxLocal.translation = ƒ.Vector3.X(5);
      
    }


  }

}