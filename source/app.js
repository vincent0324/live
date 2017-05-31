import React from 'react';
import { render } from 'react-dom';
//
import Header from './components/header/Header.react';
render(<Header />, document.getElementById('header'));

import './css/common.css';
import './css/banner.css';
import './css/detail.css';
import './css/tab.css';
import './css/like.css';
import './css/bread.css';
import './css/display.css';

import Detail from './js/Detail';
let detail = new Detail();

import Tab from './js/Tab';
let tab = new Tab();

import Update from './js/Update';
let update = new Update();

import Display from './js/Display';
let display = new Display();
