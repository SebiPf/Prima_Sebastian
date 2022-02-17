namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  //import * as Mongo from "mongodb";
  let graph: ƒ.Graph;
  let lines: ƒ.Node
  let cubes: ƒ.Node
  export let turn: String = "Player1"
  let Base: ƒ.Node
  let linestate: StateMachine
  let linestatea: StateMachine
  let linestateb: StateMachine
  let linestatec: StateMachine
  let linestated: StateMachine
  let check = false;
  
  export let col: boolean
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  export enum JOB {
    IDLE, HOVERED1, HOVERED2, PLAYER1, PLAYER2
  }
  export async function change(_event: Event): Promise<void> {

    switch (Player){
      case "Player1":
        for (let i = 0; i < 144; i++) {
          Base = graph.getChildrenByName("Base")[0]
          lines = Base.getChildrenByName("Lines")[0]
          line = lines.getChildrenByName("Line")[i]
          if (line.getComponent(StateMachine).stateCurrent == JOB.HOVERED1) {
            let inum = i.toString();
            let message = inum
            message = "linenumplayera" + inum
            client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
            message = "Player2"
            client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
          }
        }
      case "Player2":
        for (let i = 0; i < 144; i++) {
          Base = graph.getChildrenByName("Base")[0]
          lines = Base.getChildrenByName("Lines")[0]
          line = lines.getChildrenByName("Line")[i]
          if (line.getComponent(StateMachine).stateCurrent == JOB.HOVERED2) {
            let inum = i.toString();
            let message = inum
            message = "linenumplayerb" + inum
            client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
            message = "Player1"
            client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
          }
        }
    }
  }
  export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(StateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
    constructor() {
      super();
      this.instructions = StateMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;
      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);

    }
    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
      setup.setAction(JOB.HOVERED1, <ƒ.General>this.actHoverd1);
      setup.setAction(JOB.HOVERED2, <ƒ.General>this.actHoverd2);
      setup.setAction(JOB.PLAYER1, <ƒ.General>this.actPlayer1);
      setup.setAction(JOB.PLAYER2, <ƒ.General>this.actPlayer2);
      return setup;
    }

    private static async actIdle(_machine: StateMachine): Promise<void> {
      if (_machine.node.getParent().name == "Lines") {
        _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 0, 0, 255);
      }
      else {
        _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 255, 255, 255);
      }
    }
    private static async actHoverd1(_machine: StateMachine): Promise<void> {
      _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 255, 0, 255);
      //console.log()
    }
    private static async actHoverd2(_machine: StateMachine): Promise<void> {
      _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 0, 0, 255);
    }
    private static async actPlayer1(_machine: StateMachine): Promise<void> {
      _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 255, 0, 255);
    }
    private static async actPlayer2(_machine: StateMachine): Promise<void> {
      _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 0, 0, 255);
    }
    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
      }
    }

    private update = (_event: Event): void => {
      graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-01-11T11:12:36.120Z|06820"];
      let i: number = 0
      let j: number = 0
      let point: boolean = false
      //console.log(Player)
      if (turn == Player){
      switch (Player){
        case "Player1":
          for (i = 0; i < 144; i++) {
            Base = graph.getChildrenByName("Base")[0]
            lines = Base.getChildrenByName("Lines")[0]
            line = lines.getChildrenByName("Line")[i]
            linestate = line.getComponent(StateMachine);
            let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(rayDistance, line.mtxWorldInverse, true);
            if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2) {
              line.getComponent(StateMachine).transit(JOB.HOVERED1)
            }
            else if (linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2 && linestate.stateCurrent != JOB.IDLE) {
              line.getComponent(StateMachine).transit(JOB.IDLE)
            }
          }

            point = false
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
              line = lines.getChildrenByName("Line")[j]
              //console.log(cube);
              linestatea = lines.getChildrenByName("Line")[j].getComponent(StateMachine);
              linestateb = lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine);
              linestatec = lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine);
              linestated = lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine);
    
              if ((linestatea.stateCurrent == JOB.PLAYER1 || linestatea.stateCurrent == JOB.PLAYER2) && (linestateb.stateCurrent == JOB.PLAYER1 || linestateb.stateCurrent == JOB.PLAYER2) && (linestatec.stateCurrent == JOB.PLAYER1 || linestatec.stateCurrent == JOB.PLAYER2) && (linestated.stateCurrent == JOB.PLAYER1 || linestated.stateCurrent == JOB.PLAYER2)) {
                if (cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && turn == "Player1") {
                  point = true
                  Player1count += 1
                  let jnum = j.toString();
                  let message = "cubenum" + jnum
                  //cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER2)
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  Base.getComponent(ƒ.ComponentAudio).play(true)
                  message = "count" + Player2count
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                }
              }
              else {
                if (turn == "Player1" && check == true) {
                  turn = "Player2"
                  let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  check = false
                }
                if (turn == "Player2" && check == true) {
                  turn = "Player1"
                  let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  check = false
                }
              }
            }
            if (point == true) {
              if (turn == "Player1") {
                check = false
                turn = "Player2"
                let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
              }
              else if (turn == "Player2") {
    
                check = false
                turn = "Player1"
                let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
              }
              else { }
            }
            check = false
          
          this.act();
          break;
        case "Player2":
          //console.log("test")
          for (i = 0; i < 144; i++) {

            Base = graph.getChildrenByName("Base")[0]
            lines = Base.getChildrenByName("Lines")[0]
            line = lines.getChildrenByName("Line")[i]
            linestate = line.getComponent(StateMachine);
            let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(rayDistance, line.mtxWorldInverse, true);
            if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2) {
                line.getComponent(StateMachine).transit(JOB.HOVERED2)
            }
            else if (linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2 && linestate.stateCurrent != JOB.IDLE) {
              line.getComponent(StateMachine).transit(JOB.IDLE)
              //break
            }
            //console.log(line.getComponent(StateMachine).stateCurrent)
          }
          
            point = false
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
              line = lines.getChildrenByName("Line")[j]
              //console.log(cube);
              linestatea = lines.getChildrenByName("Line")[j].getComponent(StateMachine);
              linestateb = lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine);
              linestatec = lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine);
              linestated = lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine);
    
              if ((linestatea.stateCurrent == JOB.PLAYER1 || linestatea.stateCurrent == JOB.PLAYER2) && (linestateb.stateCurrent == JOB.PLAYER1 || linestateb.stateCurrent == JOB.PLAYER2) && (linestatec.stateCurrent == JOB.PLAYER1 || linestatec.stateCurrent == JOB.PLAYER2) && (linestated.stateCurrent == JOB.PLAYER1 || linestated.stateCurrent == JOB.PLAYER2)) {
                //console.log("test player 1 field")
                //console.log("test")
                if (cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && turn == "Player2") {

                  point = true
                  Player1count += 1
                  let jnum = j.toString();
                  let message = "cubenum" + jnum
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  //cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER1)
                  //cube.getComponent(StateMachine).transit(JOB.PLAYER1)
                  //point = true
                  message = "count" + Player1count
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  Base.getComponent(ƒ.ComponentAudio).play(true)
                  //Player2count += 1
                }
              }
              else {
                if (turn == "Player1" && check == true) {
                  turn = "Player2"
                  let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  check = false
                }
                if (turn == "Player2" && check == true) {
                  turn = "Player1"
                  let message = turn
                  client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                  check = false
                }
              }
            }
            if (point == true) {
              if (turn == "Player1") {
                check = false
                turn = "Player2"
                let message = turn
                client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
              }
              else if (turn == "Player2") {
                check = false
                turn = "Player1"
                let message = turn
                client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
              }
              else { }
            }
            check = false
          
        
          this.act();
          break;
      }
    }
    }
  
  }
}

