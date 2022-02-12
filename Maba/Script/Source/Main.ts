//import { count } from "console";
///<reference path="../../../Net/Build/Client/FudgeClient.d.ts"/>
//import * as Mongo from "mongodb";
namespace Script {
  import ƒ = FudgeCore;
  //import fs = FudgeServer;
  ƒ.Debug.info("Main Program Template running!");
  let camera: ƒ.Node = new ƒ.Node("Cam1")
  let graph: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let ray: ƒ.Ray;
  export let rayDistance: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0)
  export let line: ƒ.Node
  export let cube: ƒ.Node
  export let Player1count = 0
  export let Player2count = 0
  let Base: ƒ.Node
  let lines: ƒ.Node
  let cubes: ƒ.Node
  

  import ƒClient = FudgeNet.FudgeClient;
  ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);

  // Create a FudgeClient for this browser tab
  let client: ƒClient = new ƒClient();
  // keep a list of known clients, updated with information from the server
  //let clientsKnown: { [id: string]: { name?: string; isHost?: boolean; } } = {};
  //import * as Mongo from "mongodb";
  window.addEventListener("load", start);

  //wss://fudge-server.herokuapp.com
  
  export async function start(_event: Event): Promise<void> {
    
    let domServer: string = "wss://mabaprima.herokuapp.com/"
    try {
      // connect to a server with the given url
      client.connectToServer(domServer);
      
      //client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
    } catch (_error) {
      console.log(_error);
      console.log("Make sure, FudgeServer is running and accessable");
    }










    window.addEventListener("click", change);

    await ƒ.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T11:12:36.120Z|06820"];
    document.addEventListener("interactiveViewportStarted", <EventListener>start);
    camera.addComponent(new ƒ.ComponentCamera)
    camera.addComponent(new ƒ.ComponentTransform)
    camera.getComponent(ƒ.ComponentCamera).mtxPivot.translation = new ƒ.Vector3(0, 100, 0)
    camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(90, 0, 0)
    graph.addChild(camera);
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    Base = graph.getChildrenByName("Base")[0]
    lines = Base.getChildrenByName("Lines")[0]
    cubes = Base.getChildrenByName("Cubes")[0]
    for (let i = 0; i < 144; i++) {
      line = lines.getChildrenByName("Line")[i];
      line.addComponent(new StateMachine());
    }
    for (let i = 0; i < 64; i++) {
      cube = cubes.getChildrenByName("Cube")[i];
      cube.addComponent(new StateMachine());
      
    }
    graph.addComponent(new ƒ.ComponentAudioListener())
    ƒ.AudioManager.default.listenTo(graph)
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener))
    graph.getComponent(ƒ.ComponentAudioListener)
    graph.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Soundtrack.mp3"),true,true))
    Base.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Score.wav"),false,false))
    viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
    viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, hndPointerMove);
    GameState.get().player1 = Player1count;
    GameState.get().player2 = Player2count;
    //console.log(Player1count)
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  export function hndPointerMove(_event: ƒ.EventPointer): void {
    ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0))
  }
  export function hndMousclick(_event: any): void {
    ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0))
  }
  async function receiveMessage(_event: CustomEvent | MessageEvent): Promise<void> {
      console.table(_event);
  }

}