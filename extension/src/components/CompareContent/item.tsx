import { Button, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import IContent from "./content";
import parsePrice from "./price";
/* tslint:disable: jsx-no-lambda */

export interface IItem {
    content: IContent;
    controls?: {
        onSelectImage(): void;
        onSelectTitle(): void;
        onSelectPrice(): void;
    };
    onInfoError(current: any): void;
}

// tslint:disable: jsx-no-multiline-js
export function Item(props: IItem) {
    return (
        <div style={{ display: "flex", marginRight: "1em" }}>
            {/* 图片 */}
            {props.controls && !props.content.image && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={props.controls.onSelectImage}
                    style={{ width: 20, marginRight: "1em" }}
                >
                    <FormattedMessage id="goods.current.select.image" />
                </Button>
            )}
            {props.content.image && (
                <img style={{ maxWidth: "100%", maxHeight: 120, marginRight: "1em" }} src={props.content.image} />
            )}
            <div style={{ flex: 1, overflow: "hidden" }}>
                {/* 标题 */}
                <Typography
                    variant="body1"
                    style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                    {props.controls && !props.content.title && (
                        <Button onClick={props.controls.onSelectTitle}>
                            <FormattedMessage id="goods.current.select.title" />
                        </Button>
                    )}
                    <a href={props.content.url}>{props.content.title}</a>
                </Typography>
                {/* 价格 */}
                <Typography variant="h6" style={{ color: "red" }}>
                    {props.controls && props.content.price === -1 && (
                        <Button variant="outlined" color="primary" onClick={props.controls.onSelectPrice}>
                            <FormattedMessage id="goods.current.select.price" />
                        </Button>
                    )}
                    {props.content.price !== -1 && `${props.content.priceType || ""}${parsePrice(props.content.price)}`}
                </Typography>
                {/* 信息有误 */}
                {/* <Typography variant="caption">
                    <a onClick={(x) => props.onInfoError({})}>
                        {props.controls ? (
                            <FormattedMessage id={`goods.current.mismatch`} />
                        ) : (
                            <FormattedMessage id={`goods.more.mismatch`} />
                        )}
                    </a>
                </Typography> */}
            </div>
        </div>
    );
}
Item.defaultProps = {
    onInfoError() { },
    content: {
        image: "https://images-na.ssl-images-amazon.com/images/I/71i8VZL9dnL._SY879_.jpg",
        title: "Google Pixel 1st Gen 32GB",
        url: "http://",
        price: Math.floor(Math.random() * 2000),
        priceType: "$",
    },
};
