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
    let Map;
    //let graph: ƒ.Graph
    //let cmpAgent: ƒ.ComponentRigidbody;
    //let cmpMap: ƒ.ComponentRigidbody;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        //ƒ.PhysicsSettings.defaultRestitution = 0.3;
        //ƒ.Physics.settings.defaultFriction = 0.8;
        Agent = viewport.getBranch().getChildrenByName("Agent")[0];
        Map = viewport.getBranch().getChildrenByName("Map")[0];
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
        //ƒ.Physics.world.simulate();  // if physics is included and used
        let speed = 5;
        let speedjump = 10;
        let rotate = 5;
        let forward;
        forward = Agent.mtxWorld.getZ();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
            Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(forward, speed));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(forward, -speed));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            Agent.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(rotate));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            Agent.getComponent(ƒ.ComponentRigidbody).rotateBody(ƒ.Vector3.Y(-rotate));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]))
            Agent.getComponent(ƒ.ComponentRigidbody).setVelocity(ƒ.Vector3.SCALE(Agent.mtxWorld.getY(), speedjump));
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map