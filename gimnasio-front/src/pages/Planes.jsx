import React, { useState, useEffect } from 'react';
import "../styles/Planes.css";
import {Container, Button, Modal, Form, Table, Badge} from 'react-bootstrap';
import {FiEdit2, FiTrash2} from 'react-icons/fi';
import  * as api from "../service/planesService";
