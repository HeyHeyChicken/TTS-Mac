const LIBRARIES = {
    FS: require("fs"),
    NodeCMD: require("node-cmd"),
    Path: require("path"),

    Skill: require("../../../Libraries/Skill"),
    Audio: require("../../../Audio")
};

class Random extends LIBRARIES.Skill{
    constructor(_main, _settings) {
        super(_main, _settings);

        this.RootPath = LIBRARIES.Path.join(_main.DirName, "lib", "skills", "356537719", "src");

        const SELF = this;

        this.Main.TTS = function (_socket, _text, _callback){
            if(_text !== undefined){
                const FILE_NAME = "/MacTTS-" + new Date().getTime();
                const ABSOLUTE_PATH = LIBRARIES.Path.resolve(SELF.Main.DirName + "/public/mp3/TTS/") + FILE_NAME;
                const LOCAL_PATH = LIBRARIES.Path.resolve( "/mp3/TTS/") + FILE_NAME;
                const COMMAND = "say -o \"" + ABSOLUTE_PATH + ".aiff\" \"" + _text + "\"";
                LIBRARIES.NodeCMD.get(
                    COMMAND,
                    function(err, data, stderr){
                        // On convertis le fichier AIFF en MP3
                        const FFMPEG_ABSOLUTE_PATH = LIBRARIES.Path.resolve(SELF.RootPath + "/ffmpeg");
                        const CONVERT_COMMAND = FFMPEG_ABSOLUTE_PATH + " -i " + ABSOLUTE_PATH + ".aiff -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 " + ABSOLUTE_PATH + ".mp3";
                        LIBRARIES.NodeCMD.get(
                            CONVERT_COMMAND,
                            function(err, data, stderr){
                                // ON SUPPRIME l'ANCIEN FICHIER AIFF
                                LIBRARIES.FS.unlink(ABSOLUTE_PATH + ".aiff", function(){
                                    _socket.emit("play_audio", [new LIBRARIES.Audio(LOCAL_PATH + ".mp3", 1)]);
                                    if(_callback !== undefined){
                                        _callback(_text);
                                    }
                                });
                            }
                        );
                    }
                );
            }
        }
    }
}

module.exports = Random;
