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
    let graph;
    let viewport;
    let cart;
    let mtxTerrain;
    let meshTerrain;
    let camera = new ƒ.Node("Cam1");
    let ctrForward = new ƒ.Control("Forward", 20, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 300, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-11-25T11:20:14.002Z|22521"];
        let cmpMeshTerrain = graph.getChildrenByName("Map")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        cart = graph.getChildrenByName("Agent")[0];
        camera.addComponent(new ƒ.ComponentCamera);
        camera.addComponent(new ƒ.ComponentTransform);
        camera.mtxLocal.translation = new ƒ.Vector3(0, 8, -12);
        camera.mtxLocal.rotation = new ƒ.Vector3(25, 0, 0);
        document.addEventListener("interactiveViewportStarted", start);
        //graph.getChildrenByName("Agent")[0].addChild(cameraNode);
        graph.addChild(camera);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //ƒ.Physics.world.simulate();  // if physics is included and used
        //camera.mtxLocal.translation = cart.mtxWorld.translation;
        //camera.mtxLocal.rotation = new ƒ.Vector3(0,)
        camera.mtxLocal.translation = new ƒ.Vector3(cart.mtxLocal.translation.x, 8, cart.mtxLocal.translation.z - 12);
        //camera.mtxLocal.rotation = new ƒ.Vector3(25,cart.mtxWorld.rotation.y,0)
        //camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(0,cart.mtxWorld.rotation.y,0)
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        cart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        cart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);
        let terrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
        cart.mtxLocal.translation = terrainInfo.position;
        cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map