"use strict";
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor() {
            super("Agent");
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshSphere("agentmesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("agentmaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0.84, 0, 1)))));
            this.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/LaserSound.mp3"), false, false));
            //this.addComponent(new ƒ.ComponentAudioListener)
            this.mtxLocal.scale(ƒ.Vector3.ONE(.5));
            this.mtxLocal.translateY(0.5);
            console.log("testtest");
        }
    }
    LaserLeague.Agent = Agent;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.rotSpeed = 60;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        //ƒ.Debug.log(this.message, this.node);
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                }
            };
            this.update = (_event) => {
                this.node.mtxLocal.rotateZ(this.rotSpeed * ƒ.Loop.timeFrameGame / 1000);
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
    LaserLeague.CustomComponentScript = CustomComponentScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super();
            this.name = "LaserLeague";
            this.health = 1;
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        reduceMutator(_mutator) { }
    }
    LaserLeague.GameState = GameState;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    //let speedagent: number = 1;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    //let rotation: ƒ.Matrix4x4;
    let rotatingspeed = 360;
    //let transform: ƒ.Matrix4x4;
    let agent;
    //let laserbase: ƒ.Node;
    let forward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    forward.setDelay(300);
    let agenttransform;
    let copy;
    //let soundcoll: boolean;
    //let i: number = 0
    //let j: number = 0
    let LaserStruckture;
    //let graph: ƒ.Node;
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        //laserbase = graph.getChildrenByName("LaserStruckture")[0].getChildrenByName("LaserBase")[0];
        //agent = graph.getChildrenByName("Agent")[0];
        agent = new LaserLeague.Agent();
        //transform = laserbase.mtxLocal;
        graph.getChildrenByName("Agent")[0].addChild(agent);
        //soundcoll= graph.getComponent(ƒ.ComponentAudio).isPlaying;
        //rotation = graph.getChildrenByName("LaserBeam")[0].mtxLocal;
        agenttransform = agent.getComponent(ƒ.ComponentTransform).mtxLocal;
        let graphlaser = FudgeCore.Project.resources["Graph|2021-11-02T12:13:30.025Z|22534"];
        LaserStruckture = graph.getChildrenByName("LaserStrukture")[0];
        //graph.getChildrenByName("LaserStrukture")[0].addChild(copy);
        //copy.addComponent( new ƒ.ComponentTransform);
        //copy.mtxLocal.translateX(10);
        copy = await ƒ.Project.createGraphInstance(graphlaser);
        graph.getChildrenByName("LaserStrukture")[0].addChild(copy);
        agent.mtxLocal.translation = new ƒ.Vector3(6, 1, 0);
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
        copy.mtxLocal.rotateY(rotatingspeed * deltatime);
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
        viewport.draw();
        checkCollision();
        ƒ.AudioManager.default.update();
        LaserLeague.GameState.get().health -= 0.01;
    }
    function checkCollision() {
        //console.log("check: " + posLocal.toString());
        let radius = 0.25;
        let beam = LaserStruckture.getChildren()[0];
        let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
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
})(LaserLeague || (LaserLeague = {}));
//# sourceMappingURL=Script.js.map