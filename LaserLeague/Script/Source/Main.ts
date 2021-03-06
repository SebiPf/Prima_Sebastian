namespace LaserLeague {
  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");
  //let speedagent: number = 1;

  let viewport: ƒ.Viewport;
  let rotatingspeed: number = 360;
  let copy: ƒ.GraphInstance;
  let agent: Agent;
  let agenttransform: ƒ.Matrix4x4;
  let LaserStruckture: ƒ.Node
  let forward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL)
  //document.addEventListener("interactiveViewportStarted", <any>start);
window.addEventListener("load",start);
async function start(_event: Event): Promise<void> {
  await ƒ.Project.loadResourcesFromHTML();
  let graph: any = ƒ.Project.resources["Graph|2021-10-13T12:20:20.596Z|97454"];
  let cmpCamera = new ƒ.ComponentCamera();
  cmpCamera.mtxPivot.rotateX(90);
  cmpCamera.mtxPivot.rotateZ(180);
  cmpCamera.mtxPivot.translateZ(-35);
  graph.addComponent(cmpCamera);

  let canvas = document.querySelector("canvas");
  viewport = new ƒ.Viewport();
  viewport.initialize("Viewport", graph, cmpCamera, canvas);


  

  //let rotation: ƒ.Matrix4x4;
  
  //let transform: ƒ.Matrix4x4;

  
  //let laserbase: ƒ.Node;
  
  forward.setDelay(300);
  
  
  //let soundcoll: boolean;
  //let i: number = 0
  //let j: number = 0

  
  //let graph: ƒ.Node;
  
   




    graph = viewport.getBranch();
    ƒ.AudioManager.default.listenTo(graph)
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener))
    //laserbase = graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0];
    //agent = graph.getChildrenByName("Agent")[0];
    agent = new Agent();

    //transform = laserbase.mtxLocal;
    graph.getChildrenByName("Agent")[0].addChild(agent);

    //soundcoll= graph.getComponent(ƒ.ComponentAudio).isPlaying;


    //rotation = graph.getChildrenByName("LaserBeam")[0].mtxLocal;
    agenttransform = agent.getComponent(ƒ.ComponentTransform).mtxLocal;

    let graphlaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-11-02T12:13:30.025Z|22534"];
    LaserStruckture = graph.getChildrenByName("LaserStrukture")[0];


    //graph.getChildrenByName("LaserStrukture")[0].addChild(copy);
    //copy.addComponent( new ƒ.ComponentTransform);
    //copy.mtxLocal.translateX(10);


    copy = await ƒ.Project.createGraphInstance(graphlaser);
    graph.getChildrenByName("LaserStrukture")[0].addChild(copy);
    agent.mtxLocal.translation = new ƒ.Vector3(6, 1, 0);




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

    copy.mtxLocal.rotateY(rotatingspeed * deltatime);
    let value: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );
    forward.setInput(value * deltatime);
    agent.mtxLocal.translateX(forward.getOutput())
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) == true) {
      agenttransform.rotateY(turnagent * deltatime)

    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) == true) {
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
    viewport.draw();
    checkCollision();
    ƒ.AudioManager.default.update();

    GameState.get().health -= 0.01;

  }


  function checkCollision(): void {



    //console.log("check: " + posLocal.toString());
    let radius: number = 0.25;

    let beam: ƒ.Node = LaserStruckture.getChildren()[0];

    let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
    if (posLocal.x > (-5 - radius) && posLocal.x < (0 + radius) && posLocal.z < (0.25 + radius) && posLocal.z > (-0.25 - radius)) {
      console.log("Collision ");
      //agenttransform.translation.x = 5;
      agent.mtxLocal.translation = new ƒ.Vector3(6, 1, 0);
      //agent. = true;

    }
    if (posLocal.z > (-2.5 - radius) && posLocal.z < (2.5 + radius) && posLocal.x < (0.25 + radius) && posLocal.x > (-0.25 - radius)) {
      console.log("Collision ");
      //agenttransform.translation.x = 5;
      agent.mtxLocal.translation = new ƒ.Vector3(6, 1, 0);
      //agent.ComponentAudio[0].playing = true;
      //agent.playing = true;
    }
    else {
      //agent.playing = false;
    }





    //console.log(agenttransform.translation.x);



  }

}