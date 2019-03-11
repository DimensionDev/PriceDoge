/* tslint:disable:jsx-no-multiline-js */
import finder from "@medv/finder";
import * as React from "react";
import { selectElement } from "../../utils/dom";
import Message from "../../utils/messaging";
import IContent from "./content";
import { CompareUI, ICompareUIProps } from "./render";

interface IProps {
    priceType: string;
}

interface IStates {
    current: IContent | null;
    items: IContent[] | null;
    enableSelection: boolean;
    selectedSearchProvider: string;
}

function waitForMouseDown(): Promise<Node> {
    return new Promise((resolve, reject) => {
        const mouseDown = (e: MouseEvent) => {
            document.removeEventListener("mousedown", mouseDown);
            if (e.target instanceof Node) {
                resolve(e.target);
            } else {
                reject();
            }
        };
        document.addEventListener("mousedown", mouseDown);
    });
}

export default class CompareContent extends React.Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            current: null,
            enableSelection: true,
            items: null,
            selectedSearchProvider: "Amazon",
        };
        const self = this;
        Message.on("price_doge_load_current", (current) => {
            self.setState({
                current,
            });
            return true;
        });
        Message.on("priceDogeLoadItems", (items) => {
            self.setState({
                items,
            });
            return true;
        });
        Message.on("priceDogeSelection", (data) => {
            self.setState({
                enableSelection: data,
            });
            return true;
        });
    }
    public render() {
        const providers: ICompareUIProps["providers"] = [
            { intl: "shop.amazon", value: "Amazon" },
            { intl: "shop.newegg", value: "Newegg" },
            { intl: "shop.taobao", value: "Taobao" },
            { intl: "shop.jd", value: "JD" },
        ];
        return (
            <CompareUI
                providers={providers}
                currentItem={this.state.current}
                currentProvider={this.state.selectedSearchProvider}
                onProviderChange={this.updateSearchProvider}
                similarItems={this.state.items}
                controls={{
                    onSelectImage: this.updateImage,
                    onSelectPrice: this.updatePrice,
                    onSelectTitle: this.updateTitle,
                }}
            />
        );
    }

    private updateSearchProvider = (value: string) => {
        this.setState({
            items: null,
            selectedSearchProvider: value,
        });
        Message.send("priceDogeUpdateSearchProvider", value);
    };

    private updateTitle = async () => {
        const value = await this.provideValue();
        Message.send("addCustomTitleRule", value.rule);
    };

    private updateImage = async () => {
        const value = await this.provideValue();
        Message.send("addCustomImageRule", value.rule);
    };

    private updatePrice = async () => {
        const value = await this.provideValue();
        Message.send("addCustomPriceRule", value.rule);
    };

    private async provideValue() {
        const target = await selectElement();
        const rule = finder(target);
        const text = target.textContent && target.textContent.trim();
        return {
            rule,
            target,
            text,
        };
    }
}
