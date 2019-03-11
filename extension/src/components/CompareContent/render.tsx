import {
    CircularProgress,
    GridList,
    GridListTile,
    MenuItem,
    MuiThemeProvider,
    Paper,
    Select,
    Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { getLanguage, getLocalMessage } from "../../i18n";
import theme from "../../utils/theme";
import IContent from "./content";
import { IItem, Item } from "./item";
// tslint:disable: jsx-no-multiline-js

export interface ICompareUIProps {
    providers: Array<{ value: string; intl: string }>;
    currentProvider: string;
    currentItem: IContent | null;
    similarItems: IContent[] | null;
    controls: IItem["controls"];
    onProviderChange(value: string): void;
}
export function CompareUI(props: ICompareUIProps) {
    const [enableSelection, setEnableSelection] = useState(true);
    return (
        <IntlProvider locale={getLanguage()} messages={getLocalMessage(getLanguage())}>
            <MuiThemeProvider theme={theme}>
                <Paper
                    style={{ height: "100%", display: "flex", padding: "1em 0 0 2em", boxSizing: "border-box" }}
                    elevation={2}
                >
                    <div style={{ maxWidth: 300, marginBottom: "1em" }}>
                        <Typography variant="h6">
                            <FormattedMessage id="goods.current.title" />
                        </Typography>
                        <Item
                            content={props.currentItem || { image: "", price: -1, title: "", url: location.href }}
                            controls={props.controls}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Typography variant="h6">
                            <FormattedMessage id="goods.more.title" />
                            <Select
                                value={props.currentProvider}
                                // tslint:disable-next-line: jsx-no-lambda
                                onChange={(e) => props.onProviderChange(e.target.value)}
                            >
                                {props.providers.map((p) => (
                                    <MenuItem value={p.value}>
                                        <FormattedMessage id={p.intl} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Typography>
                        {props.similarItems === null && <CircularProgress />}
                        {Array.isArray(props.similarItems) && props.similarItems.length === 0 && "No content"}
                        {props.similarItems && props.similarItems.length ? (
                            <GridList style={{ flexWrap: "nowrap", margin: "0 0 1em 0", overflowY: "hidden" }}>
                                {props.similarItems
                                    .filter((x) => x)
                                    .map((value, index) => (
                                        <GridListTile
                                            key={index}
                                            style={{ width: "initial", height: "initial", maxWidth: 350 }}
                                        >
                                            <Item content={value} />
                                        </GridListTile>
                                    ))}
                            </GridList>
                        ) : (
                            undefined
                        )}
                    </div>
                </Paper>
            </MuiThemeProvider>
        </IntlProvider>
    );
}
