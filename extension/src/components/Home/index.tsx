// tslint:disable:max-line-length
import { Divider } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Button from "@material-ui/core/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import blue from "@material-ui/core/colors/blue";
import deepOrange from "@material-ui/core/colors/deepOrange";
import red from "@material-ui/core/colors/red";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { injectIntl, intlShape } from "react-intl";
import { FormattedMessage, InjectedIntlProps } from "react-intl";
import { RouteComponentProps } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import http from "../../utils/createHttp";
import { load } from "../../utils/storage";

interface IProps extends RouteComponentProps, InjectedIntlProps {
}

interface IStates {
    cartPrice: string;
    isSyncing: boolean;
    savedPrice: string;
    syncMessage: string;
    previewButtonText: string;
    previewText: string;
    isQuerying: boolean;
    // taobaoPrice: number;
    // jdPrice: number;
    price: string;
}

const redTheme = createMuiTheme({ palette: { primary: red } });
const blueTheme = createMuiTheme({ palette: { primary: blue } });
const orangeTheme = createMuiTheme({ palette: { primary: deepOrange } });
class Home extends React.Component<IProps, IStates> {

    public static getLink(dateString: string, token: string, time: number) {
        return `https://cart.taobao.com/json/asyncGetMyCart.do?isNext=true&endTime=${dateString}&page=1&_thwlang=zh_CN&_tb_token_=${token}&_ksTS=${time}`;
    }
    constructor(props: IProps) {
        super(props);
        this.state = {
            cartPrice: "0",
            isQuerying: false,
            isSyncing: false,
            previewButtonText: "cart.preview.action.loading",
            previewText: "cart.preview.desc.loading",
            price: "0",
            savedPrice: "0",
            syncMessage: "",
        };

    }

    public componentDidMount() {
        load("seedwords").then((data: any) => {
            if (data) {
                this.loadPrice();
            } else {
                this.props.history.push("/init");
            }
        });
    }

    public render() {
        return (
            <div>
                <div>
                    <div style={{ padding: "8px" }}>
                        <div className="title">
                            <FormattedMessage id="cart.sync.title" />
                        </div>
                        <p>
                            <FormattedMessage id="cart.sync.desc" />
                        </p>
                        <MuiThemeProvider theme={blueTheme}>
                            <div style={{ display: "inline-grid" }}>
                                <Button style={{ gridRow: "1", gridColumn: "1" }} disabled={this.state.isSyncing} variant="contained" color="primary" onClick={this.syncCart}>
                                    <FormattedMessage id="cart.sync.action" />
                                </Button>
                                {this.state.isSyncing && <CircularProgress style={{ gridRow: "1", gridColumn: "1", justifySelf: "center", alignSelf: "center" }} size={24} />}
                            </div>
                        </MuiThemeProvider>
                        <div>
                            {this.state.syncMessage}
                        </div>
                    </div>
                    <Divider />
                    <div style={{ padding: "8px" }}>
                        <div className="title">
                            <FormattedMessage id="cart.preview.title" />
                        </div>
                        <p>
                            {this.props.intl.formatMessage({ id: this.state.previewText }, { price: this.state.cartPrice, saved: this.state.savedPrice })}
                            {/* {this.state.previewText} */}
                        </p>
                        <MuiThemeProvider theme={redTheme}>
                            <div style={{ display: "inline-grid" }}>
                                <Button style={{ gridRow: "1", gridColumn: "1" }} variant="contained" color="primary" disabled={this.state.isQuerying}>
                                    {this.props.intl.formatMessage({ id: this.state.previewButtonText })}
                                </Button>
                                {this.state.isQuerying && <CircularProgress style={{ gridRow: "1", gridColumn: "1", justifySelf: "center", alignSelf: "center" }} size={24} />}
                            </div>
                        </MuiThemeProvider>
                    </div>
                    <Divider />
                    <div style={{ padding: "8px" }}>
                        <div className="title">
                            <FormattedMessage id="cart.assemble.title" />
                        </div>
                        <p>
                            {this.props.intl.formatMessage({ id: "cart.assemble.desc" }, { price: this.state.price })}
                            {/* 对于当前购物车中同时在天猫超市、京东超市销售的商品，最省方案只需要 ￥TODO，点击按钮，巧妙组合下单策略，总价比再任何一侧购买全部商品都要更低 */}
                        </p>
                        <MuiThemeProvider theme={orangeTheme}>
                            <Button variant="contained" color="primary">
                                <FormattedMessage id="cart.assemble.action" />
                            </Button>
                        </MuiThemeProvider>
                    </div>
                </div>
                <Divider />
                <BottomNavigation showLabels={true}>
                    <BottomNavigationAction label={<FormattedMessage id="website" />} />
                    <BottomNavigationAction label={<FormattedMessage id="feedback" />} />
                    <BottomNavigationAction label={<FormattedMessage id="setting" />} />
                </BottomNavigation>
            </div>
        );
    }

    public async loadPrice() {
        if (this.state.isQuerying) {
            return;
        }
        this.setState({
            isQuerying: true,
            previewText: "cart.preview.desc.loading",
        });
        const taobaoCookie = await getCookie(".taobao.com");
        const jdCookie = await getCookie(".jd.com");
        const token = taobaoCookie.filter((value) => value.name === "_tb_token_");
        if (token === null || token === undefined || token.length === 0) {
            this.setState({
                isQuerying: false,
                previewText: "error.10002",
            });
            return;
        }
        const result = await http.post("/cart/price", {
            cookie: taobaoCookie,
            jdCookie,
            token: token[0].value,
        });
        const { data } = result;
        if (data.code !== 0) {
            this.setState({
                isQuerying: false,
                previewText: `error.${data.code}`,
            });
            return;
        }
        let message = "";
        let buttonText = "";
        let cartPrice = "";
        let savedPrice = "";
        const { taobaoPrice, jdPrice } = data.data;
        if (taobaoPrice > jdPrice) {
            message = "cart.preview.desc.tojd";
            cartPrice = jdPrice.toFixed(2);
            savedPrice = (taobaoPrice - jdPrice).toFixed(2);
            // message = `对于当前购物车中同时在天猫超市、京东超市销售的商品，在京东超市下单总价为￥${jdPrice.toFixed(2)}，比天猫超市省￥${(taobaoPrice - jdPrice).toFixed(2)}`;
            buttonText = `cart.preview.action.tojd`;
        } else if (taobaoPrice < jdPrice) {
            cartPrice = taobaoPrice.toFixed(2);
            savedPrice = (jdPrice - taobaoPrice).toFixed(2);
            message = "cart.preview.desc.totaobao";
            // message = `对于当前购物车中同时在天猫超市、京东超市销售的商品，在天猫超市下单总价为￥${taobaoPrice.toFixed(2)}，比京东超市省￥${(jdPrice - taobaoPrice).toFixed(2)}`;
            buttonText = `cart.preview.action.totaobao`;
        } else {
            message = "cart.preview.desc.same";
            // message = `对于当前购物车中同时在天猫超市、京东超市销售的商品，在天猫超市下单总价与京东超市相同`;
            buttonText = `cart.preview.action.same`;
        }
        this.setState({
            cartPrice,
            isQuerying: false,
            previewButtonText: buttonText,
            previewText: message,
            savedPrice,
        });
    }

    public syncCart = async () => {
        if (this.state.isSyncing) {
            return;
        }
        this.setState({
            isSyncing: true,
            syncMessage: "",
        });
        const taobaoCookie = await getCookie(".taobao.com");
        const jdCookie = await getCookie(".jd.com");
        const token = taobaoCookie.filter((value) => value.name === "_tb_token_");
        if (token === null || token === undefined || token.length === 0) {
            this.setState({
                syncMessage: "error.10002",
            });
        } else {
            const result = await http.post("/cart/sync", {
                cookie: taobaoCookie,
                jdCookie,
                token: token[0].value,
            });
            const data = result.data;
            if (data.code !== 0) {
                this.setState({
                    previewText: `error.${data.code}`,
                });
            } else {
                this.setState({
                    syncMessage: "cart.sync.message.success",
                });
            }
            // switch (result.data.code) {
            //     case 10001:
            //         this.setState({
            //             syncMessage: "请先登录京东",
            //         });
            //         break;
            //     case 10002:
            //         this.setState({
            //             syncMessage: "请先登录淘宝",
            //         });
            //         break;
            //     default:
            //         this.setState({
            //             syncMessage: "同步成功",
            //         });
            //         break;
            // }
        }
        this.setState({
            isSyncing: false,
        });
    }
}

export default injectIntl(Home);
