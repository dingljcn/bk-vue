/************************* 注解导出 *************************/
import { Field } from "./annotation/Field";
import { Method } from "./annotation/Method";
import { Prop } from "./annotation/Prop";
import { Template } from "./annotation/Template";
import { Mounted } from "./annotation/Mounted";
import { Compute } from "./annotation/Compute";
import { Component } from "./annotation/Component";
import { Watch } from "./annotation/Watch";

export {
    Field,
    Method,
    Prop,
    Template,
    Mounted,
    Compute,
    Component,
    Watch
}

/************************* 组件类导出 *************************/

import { ButtonX } from "./base-component/ButtonX";
import { InputX } from "./base-component/InputX";
import { SwitchX } from "./base-component/SwitchX";
import { ComboX } from "./base-component/ComboX";
import { NavigatorX } from "./base-component/NavigatorX";
import { ScrollerY } from "./base-component/ScrollerY";
import { NavigatorView } from "./assemble-component/NavigatorView";
import { TabPanelX } from "./base-component/TabPanelX";
import { ScrollerX } from "./base-component/ScrollerX";
import { TabView } from "./assemble-component/TabView";
import { TableX } from "./base-component/TableX";
import { ProgressX } from "./base-component/ProgressX";

export {
    ButtonX,
    InputX,
    SwitchX,
    ComboX,
    NavigatorX,
    ScrollerY,
    NavigatorView,
    TabPanelX,
    ScrollerX,
    TabView,
    TableX,
    ProgressX
}

/************************* 组件导出 *************************/

const IButton = Registry.getComponent(ComponentType.ButtonX).build();
const IInput = Registry.getComponent(ComponentType.InputX).build();
const ISwitch = Registry.getComponent(ComponentType.SwitchX).build();
const ICombo = Registry.getComponent(ComponentType.ComboX).build();
const INavigator = Registry.getComponent(ComponentType.NavigatorX).build();
const IScrollerY = Registry.getComponent(ComponentType.ScrollerY).build();
const INavView = Registry.getComponent(ComponentType.NavigatorView).build();
const ITabPanel = Registry.getComponent(ComponentType.TabPanelX).build();
const IScrollerX = Registry.getComponent(ComponentType.ScrollerX).build();
const ITabView = Registry.getComponent(ComponentType.TabView).build();
const ITable = Registry.getComponent(ComponentType.TableX).build();
const IProgress = Registry.getComponent(ComponentType.ProgressX).build();

export {
    IButton,
    IInput,
    ISwitch,
    ICombo,
    INavigator,
    IScrollerY,
    INavView,
    ITabPanel,
    IScrollerX,
    ITabView,
    ITable,
    IProgress,
}

import { Registry, ComponentType } from "../entity";