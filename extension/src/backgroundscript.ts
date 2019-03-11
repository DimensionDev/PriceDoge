import backgroundService from "./backgroundService";

function runService() {
    backgroundService.forEach((it) => it.run());
}

runService();
