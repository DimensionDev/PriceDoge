import AmazonHandler from "./AmazonHandler";
import JdHandler from "./JdHandler";
import NeweggsHandler from "./NeweggsHandler";
import TaobaoHandler from "./TaobaoHandler";
import TmallHandler from "./TmallHandler";

export default [
    new AmazonHandler(),
    new TaobaoHandler(),
    new JdHandler(),
    new NeweggsHandler(),
    new TmallHandler(),
];
