"use strict";
/*namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CustomComponentScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.getContainer());
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}*/ 
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let Agent;
    //let Map: ƒ.Node
    let mtxTerrain;
    let meshTerrain;
    //let graph: ƒ.Graph
    //let cmpAgent: ƒ.ComponentRigidbody;
    //let cmpMap: ƒ.ComponentRigidbody;
    let Agentrb;
    //let cmpBall: ƒ.ComponentRigidbody;
    let ctrForward = new ƒ.Control("Forward", 20, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 5, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        //ƒ.PhysicsSettings.defaultRestitution = 0.3;
        //ƒ.Physics.settings.defaultFriction = 0.8;
        Agent = viewport.getBranch().getChildrenByName("Agent")[0];
        viewport.camera.mtxPivot.translateY(100);
        viewport.camera.mtxPivot.rotateX(90);
        //Map = viewport.getBranch().getChildrenByName("Map")[0];
        let cmpMeshTerrain = viewport.getBranch().getChildrenByName("Map")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        Agentrb = Agent.getComponent(ƒ.ComponentRigidbody);
        //Map = new ƒ.
        //cmpAgent = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
        //cmpAgent.restitution = 0.5;
        //cmpAgent.friction = 1;
        //cmpMap = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.COLLISION_GROUP.GROUP_2);
        //Agent.addComponent(cmpAgent);
        //Map.addComponent(cmpMap);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.world.simulate(); // if physics is included and used
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        Agentrb.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
        let terrainInfo1 = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x + 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + 1), mtxTerrain);
        let terrainInfo2 = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x + 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + -1), mtxTerrain);
        let terrainInfo3 = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x - 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + 1), mtxTerrain);
        let terrainInfo4 = meshTerrain.getTerrainInfo(new ƒ.Vector3(Agent.mtxLocal.translation.x - 2.5, Agent.mtxLocal.translation.y, Agent.mtxLocal.translation.z + -1), mtxTerrain);
        //Agent.mtxLocal.translation = terrainInfo1.position;
        //Agent.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo1.position, Agent.mtxLocal.getZ()), terrainInfo1.normal);
        if (Agent.mtxWorld.translation.y - terrainInfo1.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo2.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo3.position.y > 1 && Agent.mtxWorld.translation.y - terrainInfo4.position.y > 1) {
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
        }
        else if (Agent.mtxWorld.translation.y - terrainInfo1.position.y > 1) {
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
        }
        else if (Agent.mtxWorld.translation.y - terrainInfo2.position.y > 1) {
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x + 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
        }
        else if (Agent.mtxWorld.translation.y - terrainInfo3.position.y > 1) {
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z + 1));
        }
        else if (Agent.mtxWorld.translation.y - terrainInfo4.position.y > 1) {
            Agentrb.applyForceAtPoint(new ƒ.Vector3(0, -10, 0), new ƒ.Vector3(Agent.mtxWorld.translation.x - 2.5, Agent.mtxWorld.translation.y - 0.5, Agent.mtxWorld.translation.z - 1));
        }
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        Agentrb.applyForce(ƒ.Vector3.SCALE(Agent.mtxLocal.getX(), ctrForward.getOutput()));
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map