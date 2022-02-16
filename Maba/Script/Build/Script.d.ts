/// <reference path="../../../Net/Build/Client/FudgeClient.d.ts" />
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static controller;
        private static instance;
        player1: number;
        player2: number;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let rayDistance: ƒ.Vector3;
    let line: ƒ.Node;
    let cube: ƒ.Node;
    let cubes: ƒ.Node;
    let Player1count: number;
    let Player2count: number;
    let Player: string;
    import ƒClient = FudgeNet.FudgeClient;
    let client: ƒClient;
    function test(_event: Event): Promise<void>;
    function start(_event: Event): Promise<void>;
    function hndPointerMove(_event: ƒ.EventPointer): void;
}
declare namespace Script {
    import ƒAid = FudgeAid;
    let turn: String;
    let col: boolean;
    enum JOB {
        IDLE = 0,
        HOVERED1 = 1,
        HOVERED2 = 2,
        PLAYER1 = 3,
        PLAYER2 = 4
    }
    function change(_event: Event): Promise<void>;
    class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static actIdle;
        private static actHoverd1;
        private static actHoverd2;
        private static actPlayer1;
        private static actPlayer2;
        private hndEvent;
        private update;
    }
}
