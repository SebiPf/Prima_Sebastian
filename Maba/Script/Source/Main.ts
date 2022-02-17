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
  export let cubes: ƒ.Node
  export let Player1count = 0
  export let Player2count = 0
  export let Player = "Player1"
  let Base: ƒ.Node
  let lines: ƒ.Node
  import ƒClient = FudgeNet.FudgeClient;
  ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
  export let client: ƒClient = new ƒClient();
  window.addEventListener("load", test);
  

  //wss://fudge-server.herokuapp.com
  export async function test(_event: Event): Promise<void> {
    let status = document.getElementById("status");
    status.hidden = true
    window.addEventListener("click", start);
  }
  export async function start(_event: Event): Promise<void> {
    let status = document.getElementById("status");
    status.hidden = false
    let dia = document.getElementById("dia");
    dia.hidden = true
    window.removeEventListener("click", start)
    let domServer: string = "wss://mabaprima.herokuapp.com/"
    try {
      client.connectToServer(domServer);
      client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
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
    graph.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Soundtrack.mp3"), true, true))
    Base.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Score.wav"), false, false))
    viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
    viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, hndPointerMove);
    GameState.get().player1 = Player1count;
    GameState.get().player2 = Player2count;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])){
      Player = "Player1"
      let status = document.getElementById("status");
      status.hidden = true
    }
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])){
      Player = "Player2"
      let status = document.getElementById("status");
      status.hidden = true
    }
    //console.log(turn)
    //console.log(Player1count)
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  export function hndPointerMove(_event: ƒ.EventPointer): void {
    ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0))
  }

  async function receiveMessage(_event) {
    let message = JSON.parse(_event.data);
    
        if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT) {
          console.log("Player received message")
          if(message.content.message.includes("linenumplayera")){
            let num = message.content.message.match(/\d+/)[0];
            console.log(num)
            lines.getChildrenByName('Line')[num].getComponent(StateMachine).transit(JOB.PLAYER1)
          }
          else if(message.content.message.includes("linenumplayerb")){
            let num = message.content.message.match(/\d+/)[0];
            console.log(num)
            lines.getChildrenByName('Line')[num].getComponent(StateMachine).transit(JOB.PLAYER2)
          }
          else if(message.content.message.includes("PLAYER")){
            turn= message.content.message
          }
          else if(message.content.message.includes("count")){
            let num = message.content.message.match(/\d+/)[0];
            Player1count = num
          }
          else if (message.content.message.includes("cubenumPlayera")){
          let num = message.content.message.match(/\d+/)[0];
          cubes.getChildrenByName('Cube')[num].getComponent(StateMachine).transit(JOB.PLAYER1)
          Player1count += 1
          }
          else if (message.content.message.includes("cubenumPlayerb")){
            let num = message.content.message.match(/\d+/)[0];
            cubes.getChildrenByName('Cube')[num].getComponent(StateMachine).transit(JOB.PLAYER2)
            Player2count += 1
          }
        }
        else{

        }
  }
}