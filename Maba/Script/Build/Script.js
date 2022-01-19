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
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
//import * as Mongo from "mongodb";
var Script;
//import * as Mongo from "mongodb";
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let camera = new ƒ.Node("Cam1");
    let graph;
    let viewport;
    let ray;
    Script.rayDistance = new ƒ.Vector3(0, 0, 0);
    let Base;
    let lines;
    let cubes;
    //import * as Mongo from "mongodb";
    window.addEventListener("load", start);
    async function start(_event) {
        //const { MongoClient } = require('mongodb');
        //const uri = "mongodb+srv://Player1:Player1@maba.7ced4.mongodb.net/maba?retryWrites=true&w=majority";
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        /*client.connect(err => {
          const collection = client.db("test").collection("devices");
          // perform actions on the collection object
          client.close();
        });
        */
        /*async function run() {
          try {
            // Connect the client to the server
            await client.connect();
            // Establish and verify connection
            await client.db("admin").command({ ping: 1 });
            console.log("Connected successfully to server");
          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
        }
        run().catch(console.dir);
    */
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2022-01-11T11:12:36.120Z|06820"];
        document.addEventListener("interactiveViewportStarted", start);
        camera.addComponent(new ƒ.ComponentCamera);
        camera.addComponent(new ƒ.ComponentTransform);
        camera.getComponent(ƒ.ComponentCamera).mtxPivot.translation = new ƒ.Vector3(0, 80, 0);
        camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(90, 0, 0);
        graph.addChild(camera);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        Base = graph.getChildrenByName("Base")[0];
        lines = Base.getChildrenByName("Lines")[0];
        cubes = Base.getChildrenByName("Cubes")[0];
        for (let i = 0; i < 144; i++) {
            Script.line = lines.getChildrenByName("Line")[i];
            Script.line.addComponent(new Script.StateMachine());
        }
        for (let i = 0; i < 64; i++) {
            Script.cube = cubes.getChildrenByName("Cube")[i];
            Script.cube.addComponent(new Script.StateMachine());
        }
        console.log(lines);
        console.log(cubes);
        viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    Script.start = start;
    function update(_event) {
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.draw();
    }
    function hndPointerMove(_event) {
        ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
        Script.rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0));
    }
    Script.hndPointerMove = hndPointerMove;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    //import * as Mongo from "mongodb";
    let graph;
    let lines;
    let cubes;
    let turn = "Player1";
    let Base;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["HOVERED1"] = 1] = "HOVERED1";
        JOB[JOB["HOVERED2"] = 2] = "HOVERED2";
        JOB[JOB["PLAYER1"] = 3] = "PLAYER1";
        JOB[JOB["PLAYER2"] = 4] = "PLAYER2";
    })(JOB = Script.JOB || (Script.JOB = {}));
    class StateMachine extends ƒAid.ComponentStateMachine {
        constructor() {
            super();
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        this.transit(JOB.IDLE);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                }
            };
            this.update = (_event) => {
                graph = ƒ.Project.resources["Graph|2022-01-11T11:12:36.120Z|06820"];
                let i = 0;
                let check = false;
                //console.log("start for")
                for (i = 0; i < 144; i++) {
                    Base = graph.getChildrenByName("Base")[0];
                    lines = Base.getChildrenByName("Lines")[0];
                    Script.line = lines.getChildrenByName("Line")[i];
                    let posLocal = ƒ.Vector3.TRANSFORMATION(Script.rayDistance, Script.line.mtxWorldInverse, true);
                    if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && turn == "Player1") {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
                            //turn="Player2"
                            check = true;
                            Script.line.getComponent(StateMachine).transit(JOB.PLAYER1);
                        }
                        else {
                            Script.line.getComponent(StateMachine).transit(JOB.HOVERED1);
                        }
                    }
                    else if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && turn == "Player2") {
                        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ENTER])) {
                            //turn="Player1"
                            check = true;
                            Script.line.getComponent(StateMachine).transit(JOB.PLAYER2);
                        }
                        else {
                            Script.line.getComponent(StateMachine).transit(JOB.HOVERED2);
                        }
                    }
                    else if (Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER1 && Script.line.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && Script.line.getComponent(StateMachine).stateCurrent != JOB.IDLE) {
                        Script.line.getComponent(StateMachine).transit(JOB.IDLE);
                        //break
                    }
                    //console.log(line.getComponent(StateMachine).stateCurrent)
                }
                let j = 0;
                if (check == true) {
                    for (j = 0; j < 64; j++) {
                        let x = 0;
                        let y = 0;
                        if (j < 9) {
                            x = 72;
                            y = 73;
                        }
                        else if (j < 17 && j > 8) {
                            x = 73;
                            y = 74;
                        }
                        else if (j < 25 && j > 16) {
                            x = 74;
                            y = 75;
                        }
                        else if (j < 33 && j > 15) {
                            x = 75;
                            y = 76;
                        }
                        else if (j < 41 && j > 31) {
                            x = 76;
                            y = 77;
                        }
                        else if (j < 49 && j > 39) {
                            x = 77;
                            y = 78;
                        }
                        else if (j < 57 && j > 47) {
                            x = 78;
                            y = 79;
                        }
                        else if (j < 65 && j > 47) {
                            x = 79;
                            y = 80;
                        }
                        Base = graph.getChildrenByName("Base")[0];
                        cubes = Base.getChildrenByName("Cubes")[0];
                        lines = Base.getChildrenByName("Lines")[0];
                        Script.cube = cubes.getChildrenByName("Cube")[j];
                        Script.line = lines.getChildrenByName("Line")[j];
                        //console.log(cube);
                        if ((lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && turn == "Player1") {
                            //console.log("test player 1 field")
                            if (Script.cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && Script.cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER1) {
                                Script.cube.getComponent(StateMachine).transit(JOB.PLAYER2);
                                check = false;
                                turn = "Player2";
                                break;
                            }
                            //cube.getComponent(StateMachine).transit(JOB.PLAYER2)
                            //turn = "Player2"
                        }
                        else if ((lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[j].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && (lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER1 || lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine).stateCurrent == JOB.PLAYER2) && turn == "Player2") {
                            //console.log("test player 2 field")
                            if (Script.cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER2 && Script.cube.getComponent(StateMachine).stateCurrent != JOB.PLAYER1) {
                                Script.cube.getComponent(StateMachine).transit(JOB.PLAYER1);
                                check = false;
                                turn = "Player1";
                                break;
                            }
                            //cube.getComponent(StateMachine).transit(JOB.PLAYER1) 
                            //turn = "Player1"
                        }
                        else {
                            if (turn == "Player1" && check == true) {
                                turn = "Player2";
                                //console.log("test",check)
                                check = false;
                            }
                            if (turn == "Player2" && check == true) {
                                turn = "Player1";
                                //console.log("test1",check)
                                check = false;
                            }
                        }
                    }
                    check = false;
                }
                this.act();
            };
            this.instructions = StateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setAction(JOB.HOVERED1, this.actHoverd1);
            setup.setAction(JOB.HOVERED2, this.actHoverd2);
            setup.setAction(JOB.PLAYER1, this.actPlayer1);
            setup.setAction(JOB.PLAYER2, this.actPlayer2);
            return setup;
        }
        static async actIdle(_machine) {
            if (_machine.node.getParent().name == "Lines") {
                _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 0, 0, 255);
            }
            else {
                _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 255, 255, 255);
            }
        }
        static async actHoverd1(_machine) {
            _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 255, 0, 255);
            //console.log()
        }
        static async actHoverd2(_machine) {
            _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 0, 0, 255);
        }
        static async actPlayer1(_machine) {
            _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(0, 255, 0, 255);
        }
        static async actPlayer2(_machine) {
            _machine.node.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(255, 0, 0, 255);
        }
    }
    StateMachine.iSubclass = ƒ.Component.registerSubclass(StateMachine);
    StateMachine.instructions = StateMachine.get();
    Script.StateMachine = StateMachine;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map