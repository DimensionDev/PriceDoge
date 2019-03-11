import Button from "@material-ui/core/Button/Button";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import keyStore from "../../utils/keyStore";
import { load, save } from "../../utils/storage";

interface IProps extends RouteComponentProps<any> {

}

interface IStates {
    nextDisable: boolean;
    seedWords: string;
}

export default class SavePassword extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            nextDisable: true,
            seedWords: "",
        };
        const self = this;
        load("password").then(async (data: any) => {
            // tslint:disable-next-line:no-console
            console.log(data);
            if (data) {
                const key = keyStore.generate(data.password);
                await save("account", key.extendedPrivateKey);
                await save("seedwords", key.seedWord);
                self.setState({
                    seedWords: key.seedWord,
                });
            }
        });

    }

    public componentDidMount() {
        const self = this;
        load("seedwords").then((data: any) => {
            if (data) {
                self.props.history.push("/");
            }
        });
    }

    public render() {
        return (
            <div style={{ padding: "4px" }}>
                <div className="title">
                    <FormattedMessage id="seedwords.save" />
                </div> <br />
                <code>{this.state.seedWords}</code><br />
                <Button style={{ margin: "4px" }} variant="contained" onClick={this.saveJson} color="primary">
                    <FormattedMessage id="save" />
                </Button> <br />
                <Button
                    style={{ margin: "4px" }}
                    variant="contained"
                    disabled={this.state.nextDisable}
                    onClick={this.next}
                    color="secondary"
                >
                    <FormattedMessage id="next" />
                </Button> <br />
            </div>
        );
    }

    private next = () => {
        this.props.history.push("/home");
    }

    private saveJson = async () => {
        const blob = new Blob([this.state.seedWords], { type: "plain/text; charset=utf-8" });
        const i = window.document.createElement("a");
        i.target = "_blank";
        i.href = window.URL.createObjectURL(blob);
        i.download = "seedwords.txt";
        document.body.appendChild(i);
        i.click();
        document.body.removeChild(i);
        this.setState({
            nextDisable: false,
        });
        await save("seedwords", this.state.seedWords);
    }
}
