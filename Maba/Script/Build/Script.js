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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super();
            this.player1 = 1;
            this.player2 = 1;
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
    Script.GameState = GameState;
})(Script || (Script = {}));
//import { count } from "console";
///<reference path="../../../Net/Build/Client/FudgeClient.d.ts"/>
//import * as Mongo from "mongodb";
var Script;
//import { count } from "console";
///<reference path="../../../Net/Build/Client/FudgeClient.d.ts"/>
//import * as Mongo from "mongodb";
(function (Script) {
    var ƒ = FudgeCore;
    //import fs = FudgeServer;
    ƒ.Debug.info("Main Program Template running!");
    let camera = new ƒ.Node("Cam1");
    let graph;
    let viewport;
    let ray;
    Script.rayDistance = new ƒ.Vector3(0, 0, 0);
    Script.Player1count = 0;
    Script.Player2count = 0;
    Script.Player = "Player1";
    let Base;
    let lines;
    var ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    Script.client = new ƒClient();
    window.addEventListener("load", test);
    //wss://fudge-server.herokuapp.com
    async function test(_event) {
        let status = document.getElementById("status");
        status.hidden = true;
        window.addEventListener("click", start);
    }
    Script.test = test;
    async function start(_event) {
        let status = document.getElementById("status");
        status.hidden = false;
        let dia = document.getElementById("dia");
        dia.hidden = true;
        window.removeEventListener("click", start);
        let domServer = "wss://mabaprima.herokuapp.com/";
        try {
            Script.client.connectToServer(domServer);
            Script.client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
        }
        catch (_error) {
            console.log(_error);
            console.log("Make sure, FudgeServer is running and accessable");
        }
        window.addEventListener("click", Script.change);
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2022-01-11T11:12:36.120Z|06820"];
        document.addEventListener("interactiveViewportStarted", start);
        camera.addComponent(new ƒ.ComponentCamera);
        camera.addComponent(new ƒ.ComponentTransform);
        camera.getComponent(ƒ.ComponentCamera).mtxPivot.translation = new ƒ.Vector3(0, 100, 0);
        camera.getComponent(ƒ.ComponentCamera).mtxPivot.rotation = new ƒ.Vector3(90, 0, 0);
        graph.addChild(camera);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        Base = graph.getChildrenByName("Base")[0];
        lines = Base.getChildrenByName("Lines")[0];
        Script.cubes = Base.getChildrenByName("Cubes")[0];
        for (let i = 0; i < 144; i++) {
            Script.line = lines.getChildrenByName("Line")[i];
            Script.line.addComponent(new Script.StateMachine());
        }
        for (let i = 0; i < 64; i++) {
            Script.cube = Script.cubes.getChildrenByName("Cube")[i];
            Script.cube.addComponent(new Script.StateMachine());
        }
        graph.addComponent(new ƒ.ComponentAudioListener());
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        graph.getComponent(ƒ.ComponentAudioListener);
        graph.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Soundtrack.mp3"), true, true));
        Base.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("././Sound/Score.wav"), false, false));
        viewport.initialize("Viewport", graph, camera.getComponent(ƒ.ComponentCamera), canvas);
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    Script.start = start;
    function update(_event) {
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        Script.GameState.get().player1 = Script.Player1count;
        Script.GameState.get().player2 = Script.Player2count;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            Script.Player = "Player1";
            let status = document.getElementById("status");
            status.hidden = true;
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            Script.Player = "Player2";
            let status = document.getElementById("status");
            status.hidden = true;
        }
        //console.log(turn)
        //console.log(Player1count)
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndPointerMove(_event) {
        ray = viewport.getRayFromClient(new ƒ.Vector2(_event.pointerX, _event.pointerY));
        Script.rayDistance = ray.intersectPlane(new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, 1, 0));
    }
    Script.hndPointerMove = hndPointerMove;
    async function receiveMessage(_event) {
        let message = JSON.parse(_event.data);
        Base = graph.getChildrenByName("Base")[0];
        lines = Base.getChildrenByName("Lines")[0];
        if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT) {
            console.log("Player received message " + message.content.message);
            if (message.content.message.includes("linenumplayera")) {
                let num = message.content.message.match(/\d+/)[0];
                console.log("num: " + num);
                lines.getChildrenByName('Line')[num].getComponent(Script.StateMachine).transit(Script.JOB.PLAYER1);
                this.act;
            }
            else if (message.content.message.includes("linenumplayerb")) {
                let num = message.content.message.match(/\d+/)[0];
                console.log("num: " + num);
                lines.getChildrenByName('Line')[num].getComponent(Script.StateMachine).transit(Script.JOB.PLAYER2);
            }
            else if (message.content.message.includes("Player")) {
                Script.turn = message.content.message;
            }
            else if (message.content.message.includes("count")) {
                let num = message.content.message.match(/\d+/)[0];
                Script.Player1count = num;
            }
            else if (message.content.message.includes("cubenumPlayera")) {
                let num = message.content.message.match(/\d+/)[0];
                Script.cubes.getChildrenByName('Cube')[num].getComponent(Script.StateMachine).transit(Script.JOB.PLAYER1);
                Script.Player1count += 1;
            }
            else if (message.content.message.includes("cubenumPlayerb")) {
                let num = message.content.message.match(/\d+/)[0];
                Script.cubes.getChildrenByName('Cube')[num].getComponent(Script.StateMachine).transit(Script.JOB.PLAYER2);
                Script.Player2count += 1;
            }
        }
        else {
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    //import * as Mongo from "mongodb";
    let graph;
    let lines;
    let cubes;
    Script.turn = "Player1";
    let Base;
    let linestate;
    let linestatea;
    let linestateb;
    let linestatec;
    let linestated;
    let check = false;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["HOVERED1"] = 1] = "HOVERED1";
        JOB[JOB["HOVERED2"] = 2] = "HOVERED2";
        JOB[JOB["PLAYER1"] = 3] = "PLAYER1";
        JOB[JOB["PLAYER2"] = 4] = "PLAYER2";
    })(JOB = Script.JOB || (Script.JOB = {}));
    async function change(_event) {
        switch (Script.Player) {
            case "Player1":
                for (let i = 0; i < 144; i++) {
                    Base = graph.getChildrenByName("Base")[0];
                    lines = Base.getChildrenByName("Lines")[0];
                    Script.line = lines.getChildrenByName("Line")[i];
                    if (Script.line.getComponent(StateMachine).stateCurrent == JOB.HOVERED1) {
                        let inum = i.toString();
                        let message = inum;
                        message = "linenumplayera" + inum;
                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                        message = "Player2";
                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                    }
                }
            case "Player2":
                for (let i = 0; i < 144; i++) {
                    Base = graph.getChildrenByName("Base")[0];
                    lines = Base.getChildrenByName("Lines")[0];
                    Script.line = lines.getChildrenByName("Line")[i];
                    if (Script.line.getComponent(StateMachine).stateCurrent == JOB.HOVERED2) {
                        let inum = i.toString();
                        let message = inum;
                        message = "linenumplayerb" + inum;
                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                        message = "Player1";
                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                    }
                }
        }
    }
    Script.change = change;
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
                let j = 0;
                let point = false;
                //console.log(Player)
                if (Script.turn == Script.Player) {
                    switch (Script.Player) {
                        case "Player1":
                            for (i = 0; i < 144; i++) {
                                Base = graph.getChildrenByName("Base")[0];
                                lines = Base.getChildrenByName("Lines")[0];
                                Script.line = lines.getChildrenByName("Line")[i];
                                linestate = Script.line.getComponent(StateMachine);
                                let posLocal = ƒ.Vector3.TRANSFORMATION(Script.rayDistance, Script.line.mtxWorldInverse, true);
                                if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2) {
                                    Script.line.getComponent(StateMachine).transit(JOB.HOVERED1);
                                }
                                else if (linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2 && linestate.stateCurrent != JOB.IDLE) {
                                    Script.line.getComponent(StateMachine).transit(JOB.IDLE);
                                }
                            }
                            point = false;
                            for (j = 0; j < 64; j++) {
                                let x = 0;
                                let y = 0;
                                if (j < 8) {
                                    x = 72;
                                    y = 73;
                                }
                                else if (j < 16 && j > 7) {
                                    x = 73;
                                    y = 74;
                                }
                                else if (j < 24 && j > 15) {
                                    x = 74;
                                    y = 75;
                                }
                                else if (j < 32 && j > 23) {
                                    x = 75;
                                    y = 76;
                                }
                                else if (j < 40 && j > 31) {
                                    x = 76;
                                    y = 77;
                                }
                                else if (j < 48 && j > 39) {
                                    x = 77;
                                    y = 78;
                                }
                                else if (j < 56 && j > 47) {
                                    x = 78;
                                    y = 79;
                                }
                                else if (j < 64 && j > 55) {
                                    x = 79;
                                    y = 80;
                                }
                                Base = graph.getChildrenByName("Base")[0];
                                cubes = Base.getChildrenByName("Cubes")[0];
                                lines = Base.getChildrenByName("Lines")[0];
                                Script.cube = cubes.getChildrenByName("Cube")[j];
                                Script.line = lines.getChildrenByName("Line")[j];
                                //console.log(cube);
                                linestatea = lines.getChildrenByName("Line")[j].getComponent(StateMachine);
                                linestateb = lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine);
                                linestatec = lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine);
                                linestated = lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine);
                                if ((linestatea.stateCurrent == JOB.PLAYER1 || linestatea.stateCurrent == JOB.PLAYER2) && (linestateb.stateCurrent == JOB.PLAYER1 || linestateb.stateCurrent == JOB.PLAYER2) && (linestatec.stateCurrent == JOB.PLAYER1 || linestatec.stateCurrent == JOB.PLAYER2) && (linestated.stateCurrent == JOB.PLAYER1 || linestated.stateCurrent == JOB.PLAYER2)) {
                                    if (Script.cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && Script.turn == "Player1") {
                                        point = true;
                                        Script.Player1count += 1;
                                        let jnum = j.toString();
                                        let message = "cubenum" + jnum;
                                        //cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER2)
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        Base.getComponent(ƒ.ComponentAudio).play(true);
                                        message = "count" + Script.Player2count;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                    }
                                }
                                else {
                                    if (Script.turn == "Player1" && check == true) {
                                        Script.turn = "Player2";
                                        let message = Script.turn;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        check = false;
                                    }
                                    if (Script.turn == "Player2" && check == true) {
                                        Script.turn = "Player1";
                                        let message = Script.turn;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        check = false;
                                    }
                                }
                            }
                            if (point == true) {
                                if (Script.turn == "Player1") {
                                    check = false;
                                    Script.turn = "Player2";
                                    let message = Script.turn;
                                    Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                }
                                else if (Script.turn == "Player2") {
                                    check = false;
                                    Script.turn = "Player1";
                                    let message = Script.turn;
                                    Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                }
                                else { }
                            }
                            check = false;
                            this.act();
                            break;
                        case "Player2":
                            //console.log("test")
                            for (i = 0; i < 144; i++) {
                                Base = graph.getChildrenByName("Base")[0];
                                lines = Base.getChildrenByName("Lines")[0];
                                Script.line = lines.getChildrenByName("Line")[i];
                                linestate = Script.line.getComponent(StateMachine);
                                let posLocal = ƒ.Vector3.TRANSFORMATION(Script.rayDistance, Script.line.mtxWorldInverse, true);
                                if (posLocal.x > (-0.5) && posLocal.x < (0.5) && posLocal.z < (0.5) && posLocal.z > (-0.5) && linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2) {
                                    Script.line.getComponent(StateMachine).transit(JOB.HOVERED2);
                                }
                                else if (linestate.stateCurrent != JOB.PLAYER1 && linestate.stateCurrent != JOB.PLAYER2 && linestate.stateCurrent != JOB.IDLE) {
                                    Script.line.getComponent(StateMachine).transit(JOB.IDLE);
                                    //break
                                }
                                //console.log(line.getComponent(StateMachine).stateCurrent)
                            }
                            point = false;
                            for (j = 0; j < 64; j++) {
                                let x = 0;
                                let y = 0;
                                if (j < 8) {
                                    x = 72;
                                    y = 73;
                                }
                                else if (j < 16 && j > 7) {
                                    x = 73;
                                    y = 74;
                                }
                                else if (j < 24 && j > 15) {
                                    x = 74;
                                    y = 75;
                                }
                                else if (j < 32 && j > 23) {
                                    x = 75;
                                    y = 76;
                                }
                                else if (j < 40 && j > 31) {
                                    x = 76;
                                    y = 77;
                                }
                                else if (j < 48 && j > 39) {
                                    x = 77;
                                    y = 78;
                                }
                                else if (j < 56 && j > 47) {
                                    x = 78;
                                    y = 79;
                                }
                                else if (j < 64 && j > 55) {
                                    x = 79;
                                    y = 80;
                                }
                                Base = graph.getChildrenByName("Base")[0];
                                cubes = Base.getChildrenByName("Cubes")[0];
                                lines = Base.getChildrenByName("Lines")[0];
                                Script.cube = cubes.getChildrenByName("Cube")[j];
                                Script.line = lines.getChildrenByName("Line")[j];
                                //console.log(cube);
                                linestatea = lines.getChildrenByName("Line")[j].getComponent(StateMachine);
                                linestateb = lines.getChildrenByName("Line")[(j + x)].getComponent(StateMachine);
                                linestatec = lines.getChildrenByName("Line")[(j + y)].getComponent(StateMachine);
                                linestated = lines.getChildrenByName("Line")[(j + 8)].getComponent(StateMachine);
                                if ((linestatea.stateCurrent == JOB.PLAYER1 || linestatea.stateCurrent == JOB.PLAYER2) && (linestateb.stateCurrent == JOB.PLAYER1 || linestateb.stateCurrent == JOB.PLAYER2) && (linestatec.stateCurrent == JOB.PLAYER1 || linestatec.stateCurrent == JOB.PLAYER2) && (linestated.stateCurrent == JOB.PLAYER1 || linestated.stateCurrent == JOB.PLAYER2)) {
                                    //console.log("test player 1 field")
                                    //console.log("test")
                                    if (Script.cube.getComponent(StateMachine).stateCurrent == JOB.IDLE && Script.turn == "Player2") {
                                        point = true;
                                        Script.Player1count += 1;
                                        let jnum = j.toString();
                                        let message = "cubenum" + jnum;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        //cubes.getChildrenByName('Cube')[j].getComponent(StateMachine).transit(JOB.PLAYER1)
                                        //cube.getComponent(StateMachine).transit(JOB.PLAYER1)
                                        //point = true
                                        message = "count" + Script.Player1count;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        Base.getComponent(ƒ.ComponentAudio).play(true);
                                        //Player2count += 1
                                    }
                                }
                                else {
                                    if (Script.turn == "Player1" && check == true) {
                                        Script.turn = "Player2";
                                        let message = Script.turn;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        check = false;
                                    }
                                    if (Script.turn == "Player2" && check == true) {
                                        Script.turn = "Player1";
                                        let message = Script.turn;
                                        Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                        check = false;
                                    }
                                }
                            }
                            if (point == true) {
                                if (Script.turn == "Player1") {
                                    check = false;
                                    Script.turn = "Player2";
                                    let message = Script.turn;
                                    Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                }
                                else if (Script.turn == "Player2") {
                                    check = false;
                                    Script.turn = "Player1";
                                    let message = Script.turn;
                                    Script.client.dispatch({ route: "ws" ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { message } });
                                }
                                else { }
                            }
                            check = false;
                            this.act();
                            break;
                    }
                }
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