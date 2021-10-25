"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    //let speedagent: number = 1;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    //let rotation: ƒ.Matrix4x4;
    let rotatingspeed = 360;
    let transform;
    let agent;
    let laserbase;
    let forward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    forward.setDelay(300);
    let agenttransform;
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        laserbase = graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0];
        agent = graph.getChildrenByName("Agent")[0];
        transform = laserbase.getComponent(ƒ.ComponentTransform).mtxLocal;
        //rotation = graph.getChildrenByName("LaserBeam")[0].mtxLocal;
        agenttransform = agent.getComponent(ƒ.ComponentTransform).mtxLocal;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
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
    function update(_event) {
        let deltatime = ƒ.Loop.timeFrameReal / 1000;
        let turnagent = 360;
        transform.rotateY(rotatingspeed * deltatime);
        let value = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        forward.setInput(value * deltatime);
        agent.mtxLocal.translateX(forward.getOutput());
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) == true) {
            agenttransform.rotateY(turnagent * deltatime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) == true) {
            agenttransform.rotateY(-turnagent * deltatime);
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
    function checkCollision() {
        let beam = laserbase.getChildren()[0];
        let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        //console.log("check: " + posLocal.toString());
        console.log(agenttransform.translation.x);
        if (posLocal.x > -5 && posLocal.x < 0 && posLocal.z < 0.5 && posLocal.z > -0.5) {
            console.log("Collision ");
            agenttransform.translation.x = 5;
            agent.mtxWorld.translation.x = 5;
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map