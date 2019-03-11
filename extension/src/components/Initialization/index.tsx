// tslint:disable:max-line-length
// tslint:disable:jsx-no-lambda
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import keyStore from "../../utils/keyStore";
import { save } from "../../utils/storage";

interface IProps extends RouteComponentProps<any> {
}

interface IStates {
    confirmPassword: string;
    password: string;
    seedWord: string;
    isImportError: boolean;
}

export default class Initialization extends React.Component<IProps, IStates> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            confirmPassword: "",
            isImportError: false,
            password: "",
            seedWord: "",
        };
    }

    public render() {
        return (
            <div style={{ padding: "4px" }}>
                <div>
                    <div className="title">
                        <FormattedMessage id="seedwords.create" />
                    </div><br />
                    <TextField onChange={(event: any) => this.setState({ password: event.target.value })} type="password" label={<FormattedMessage id="password" />} /><br />
                    <TextField onChange={(event: any) => this.setState({ confirmPassword: event.target.value })} type="password" label={<FormattedMessage id="password_confirm" />} /><br />
                    <Button style={{ margin: "4px" }} variant="contained" onClick={this.confirm} color="primary"><FormattedMessage id="confirm" /></Button><br />
                </div>
                <Divider />
                <div>
                    <div className="title">
                        <FormattedMessage id="seedwords.import" />
                    </div><br />
                    <TextField helperText={this.state.isImportError && <FormattedMessage id="seedwords.incorrect" />} error={this.state.isImportError} onChange={(event: any) => this.setState({ seedWord: event.target.value, isImportError: false })} label={<FormattedMessage id="seedwords.input" />} /><br />
                    <TextField onChange={(event: any) => this.setState({ password: event.target.value })} type="password" label={<FormattedMessage id="password" />} /><br />
                    <TextField onChange={(event: any) => this.setState({ confirmPassword: event.target.value })} type="password" label={<FormattedMessage id="password_confirm" />} /><br />
                    <Button style={{ margin: "4px" }} variant="contained" onClick={this.confirmRestore} color="primary"><FormattedMessage id="confirm" /></Button><br />
                </div>
            </div>
        );
    }

    private confirmRestore = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            return;
        }
        if (this.state.password.length === 0) {
            return;
        }
        try {
            const key = keyStore.recover(this.state.seedWord, this.state.password);
            await save("account", key.extendedPrivateKey);
            await save("password", key.password);
            await save("seedwords", key.seedWord);
            this.props.history.push("/home");
        } catch (error) {
            this.setState({
                isImportError: true,
            });
        }
    }

    private confirm = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            return;
        }
        if (this.state.password.length === 0) {
            return;
        }
        // tslint:disable-next-line:no-console
        console.log(this.state.password);
        await save("seedwords", "");
        await save("password", this.state.password);
        this.props.history.push("/savepassword");
    }
}
