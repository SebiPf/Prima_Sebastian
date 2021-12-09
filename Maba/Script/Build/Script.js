"use strict";
var Maba;
(function (Maba) {
    var ƒ = FudgeCore;
    class Base extends ƒ.Node {
        constructor() {
            super("Base");
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("BaseMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("BaseMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0.84, 0, 1)))));
            //this.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/LaserSound.mp3"), false,false));   
            this.mtxLocal.scale(ƒ.Vector3.ONE(2));
        }
    }
    Maba.Base = Base;
})(Maba || (Maba = {}));
var Maba;
(function (Maba) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Maba); // Register the namespace to FUDGE for serialization
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
    Maba.CustomComponentScript = CustomComponentScript;
})(Maba || (Maba = {}));
var Maba;
(function (Maba) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let Main;
    let viewport;
    let camera;
    let base;
    //let ligth: ƒ.Node;
    window.addEventListener("load", start);
    async function start(_enent) {
        camera = new ƒ.Node("Cam");
        await ƒ.Project.loadResourcesFromHTML();
        document.addEventListener("interactiveViewportStarted", start);
        let canvas = document.querySelector("canvas");
        Main = ƒ.Project.resources["Graph|2021-12-01T18:28:10.150Z|79155"];
        Main.addChild(camera);
        camera.addComponent(new ƒ.ComponentCamera);
        camera.addComponent(new ƒ.ComponentTransform);
        //ligth.addComponent(new ƒ.Light(new ƒ.Color(0,0,0,1)))
        let cmpCamera = camera.getComponent(ƒ.ComponentCamera);
        //Main.addComponent(cmpCamera);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(-5, 0, 0);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 0, 0);
        viewport = new ƒ.Viewport();
        base = new Maba.Base();
        Main.addChild(base);
        base.mtxLocal.scaleX(10);
        viewport.initialize("Viewport", Main, cmpCamera, canvas);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        base.mtxLocal.translate(new ƒ.Vector3(1, 1, 1));
        console.log("test");
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Maba || (Maba = {}));
//# sourceMappingURL=Script.js.map