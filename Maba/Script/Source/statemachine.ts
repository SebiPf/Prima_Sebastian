namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  //import * as Mongo from "mongodb";
  let graph: ƒ.Graph;
  let lines: ƒ.Node
  let cubes: ƒ.Node
  let turn: String = "Player1"
  let Base: ƒ.Node
  export let col: boolean
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  export enum JOB {
    IDLE, HOVERED1, HOVERED2, PLAYER1, PLAYER2
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
      _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 0, 255, 255);

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
      let check = false;
      //console.log("start for")
      for (i = 0; i < 144; i++) {

        Base = graph.getChildrenByName("Base")[0]
        lines = Base.getChildrenByName("Lines")[0]
        line = lines.getChildrenByName("Line")[i]
        let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(rayDistance, line.mtxWorldInverse, true);
        if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && turn == "Player1") {
          if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
            //turn="Player2"
            check = true
            line.getComponent(StateMachine).transit(JOB.PLAYER1)
            
          }
          else {
            line.getComponent(StateMachine).transit(JOB.HOVERED1)
            
          }
        }
        else if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && turn == "Player2") {
          if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
            //turn="Player1"
            check = true
            line.getComponent(StateMachine).transit(JOB.PLAYER2)
            
          }
          else {
            line.getComponent(StateMachine).transit(JOB.HOVERED2)
            
          }
        }
        else if (line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2&&line.getComponent(StateMachine).stateCurrent != JOB.IDLE) {
          line.getComponent(StateMachine).transit(JOB.IDLE)
          //break
        }
        //console.log(line.getComponent(StateMachine).stateCurrent)
      }
      let j: number = 0
      if (check == true) {
        for (j = 0; j < 64; j++) {
          let x = 0
          let y = 0
          if (j < 9) {
            x = 72
            y = 73
          }
          else if (j < 17 && j > 8) {
            x = 73
            y = 74
          }
          else if (j < 25 && j > 16) {
            x = 74
            y = 75
          }
          else if (j < 33 && j > 15) {
            x = 75
            y = 76
          }
          else if (j < 41 && j > 31) {
            x = 76
            y = 77
          }
          else if (j < 49 && j > 39) {
            x = 77
            y = 78
          }
          else if (j < 57 && j > 47) {
            x = 78
            y = 79
          }
          else if (j < 65 && j > 47) {
            x = 79
            y = 80
          }

          Base = graph.getChildrenByName("Base")[0]
          cubes = Base.getChildrenByName("Cubes")[0]
          lines = Base.getChildrenByName("Lines")[0]
          cube = cubes.getChildrenByName("Cube")[j]
          line = lines.getChildrenByName("Line")[j]
          //console.log(cube);
          
          if ((lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && turn == "Player1") {
            //console.log("test player 1 field")
            if (cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER1) {
              cube.getComponent(StateMachine).transit(JOB.PLAYER2)
              check = false
              turn = "Player2"
              break
            }
            
            //cube.getComponent(StateMachine).transit(JOB.PLAYER2)
            //turn = "Player2"
            
          }
          else if ((lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && turn == "Player2") {
            //console.log("test player 2 field")
            if (cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER1) {
              cube.getComponent(StateMachine).transit(JOB.PLAYER1)
              check = false
              turn = "Player1"
              break
            }
            

            //cube.getComponent(StateMachine).transit(JOB.PLAYER1) 
            //turn = "Player1"
            
          }
          
          else {
            if(turn == "Player1"&&check == true){
              turn = "Player2"
              //console.log("test",check)
              check = false
            }
            if(turn == "Player2"&&check == true){
              turn = "Player1"
              //console.log("test1",check)
              check = false
            }

          }
          
        }
        check = false
      }
      this.act();
    }
  }
}