namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  let graph: ƒ.Graph;
  let lines: ƒ.Node
  export let turn: String = "Player1"
  let Base: ƒ.Node
  let linestate: StateMachine
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
            lines.getChildrenByName('Line')[i].getComponent(StateMachine).transit(JOB.PLAYER1)
            Checkpoint()            
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
            lines.getChildrenByName('Line')[i].getComponent(StateMachine).transit(JOB.PLAYER2)
            Checkpoint()
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
            }
          }
            check = false
          this.act();
          break;
      }
    }
    }
  
  }
}

