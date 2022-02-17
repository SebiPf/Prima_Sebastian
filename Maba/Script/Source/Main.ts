///<reference path="../../../Net/Build/Client/FudgeClient.d.ts"/>
namespace Script {
  import ƒ = FudgeCore;
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
  let linestatea: StateMachine
  let linestateb: StateMachine
  let linestatec: StateMachine
  let linestated: StateMachine
  let j: number = 0
  let Base: ƒ.Node
  let lines: ƒ.Node
  export let check: boolean;
  import ƒClient = FudgeNet.FudgeClient;
  ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
  export let client: ƒClient = new ƒClient();
  window.addEventListener("load", test);
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
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      Player = "Player1"
      let status = document.getElementById("status");
      status.hidden = true
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      Player = "Player2"
      let status = document.getElementById("status");
      status.hidden = true
    }
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  export function hndPointerMove(_event: ƒ.EventPointer): void {
    ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0))
  }
  async function receiveMessage(_event) {
    let message = JSON.parse(_event.data);
    Base = graph.getChildrenByName("Base")[0]
    lines = Base.getChildrenByName("Lines")[0]
    if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT) {
      console.log("Player received message " + message.content.message)
      if (message.content.message.includes("linenumplayera")) {
        let num = message.content.message.match(/\d+/)[0];
        console.log("num: " + num)
        lines.getChildrenByName('Line')[num].getComponent(StateMachine).transit(JOB.PLAYER1)
        this.act;
      }
      else if (message.content.message.includes("linenumplayerb")) {
        let num = message.content.message.match(/\d+/)[0];
        console.log("num: " + num)
        lines.getChildrenByName('Line')[num].getComponent(StateMachine).transit(JOB.PLAYER2)
      }
      else if (message.content.message.includes("Player")) {
        turn = message.content.message
      }
      else if (message.content.message.includes("count")) {
        let num = message.content.message.match(/\d+/)[0];
        Player1count = num
      }
      else if (message.content.message.includes("cubenumplayera")) {
        let num = message.content.message.match(/\d+/)[0];
        cubes.getChildrenByName('Cube')[num].getComponent(StateMachine).transit(JOB.PLAYER1)
        Player1count += 1
      }
      else if (message.content.message.includes("cubenumplayerb")) {
        let num = message.content.message.match(/\d+/)[0];
        cubes.getChildrenByName('Cube')[num].getComponent(StateMachine).transit(JOB.PLAYER2)
        Player2count += 1
      }
    }
    else {
    }
  }
  export async function Checkpoint() {
    console.log("ich werde aufgerufen")
    let message: String
    let checkPlayer1: boolean = false
    let checkPlayer2: boolean = false
    for (j = 0; j < 64; j++) {
      let x = 0
      let y = 0
      if (j < 8) {
        x = 72
        y = 73
      }
      else if (j < 16 && j > 7) {
        x = 73
        y = 74
      }
      else if (j < 24 && j > 15) {
        x = 74
        y = 75
      }
      else if (j < 32 && j > 23) {
        x = 75
        y = 76
      }
      else if (j < 40 && j > 31) {
        x = 76
        y = 77
      }
      else if (j < 48 && j > 39) {
        x = 77
        y = 78
      }
      else if (j < 56 && j > 47) {
        x = 78
        y = 79
      }
      else if (j < 64 && j > 55) {
        x = 79
        y = 80
      }
      Base = graph.getChildrenByName("Base")[0]
      cubes = Base.getChildrenByName("Cubes")[0]
      lines = Base.getChildrenByName("Lines")[0]
      cube = cubes.getChildrenByName("Cube")[j]
      linestatea = lines.getChildrenByName("Line")[j].getComponent(StateMachine);
      linestateb = lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine);
      linestatec = lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine);
      linestated = lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine);
      if ((linestatea.stateCurrent == JOB.PLAYER1 || linestatea.stateCurrent == JOB.PLAYER2) && (linestateb.stateCurrent == JOB.PLAYER1 || linestateb.stateCurrent == JOB.PLAYER2) && (linestatec.stateCurrent == JOB.PLAYER1 || linestatec.stateCurrent == JOB.PLAYER2) && (linestated.stateCurrent == JOB.PLAYER1 || linestated.stateCurrent == JOB.PLAYER2)) {
        console.log("should be a point at this point");
        if (cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && turn == "Player1") {
          let jnum = j.toString();
          let message = "cubenumplayera" + jnum
          client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
          cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER1)
          Base.getComponent(ƒ.ComponentAudio).play(true)
          console.log("i did something");
          checkPlayer1 = true
        }
        else if (cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && turn == "Player2") {
          let jnum = j.toString();
          let message = "cubenumplayerb" + jnum
          client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
          cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER2)
          Base.getComponent(ƒ.ComponentAudio).play(true)
          console.log("i did something");
          checkPlayer2 = true
        }
      }
      else {
        console.log("i change the turn");
        if (turn == "Player1") {
          message = "Player2"
        }
        else if (turn == "Player2") {
          message = "Player1"
        }
      }
    }
    if(checkPlayer1 == true) {
      message = "Player1"
    }
    else if(checkPlayer2 == true){
      message = "Player2"
    }
    client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
  }
}