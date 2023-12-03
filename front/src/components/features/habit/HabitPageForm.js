// 컴포넌트 분리 및 api 수정중
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Col, Row, Image } from 'react-bootstrap';
import HabitCardForm from "./HabitCardForm";
import calendar from "../../../assets/imgs/calendar.png";
import './HabitPage.css';

//, selectedHabits
export default function HabitForm ({ userInfo, habitList }) {
    const { userName, turtleLevel } = userInfo;
    const habits = habitList;
    const selectedHabits = null;
    console.log('HabitForm selectedHabits', selectedHabits);

    return (
        <>
            <Container className="habits-container">
                <Row>
                    <TurtleForm userName={userName} turtleLevel={turtleLevel}/>
                    <HabitCardForm userName={userName}
                                   habits={habits}
                                   selectedHabits={selectedHabits}/>
                </Row>
            </Container>
        </>
    )
};


const TurtleForm = ({ userName, turtleLevel }) => {
    const navigate = useNavigate();

    const getTurtleImage = (level) => {
        const turtleImg = require(`../../../assets/imgs/거북이${level}.png`);
        return (
            <Card.Body className="d-flex justify-content-center align-items-center">
                <Card.Img src={turtleImg} alt="Card image" style={{ width: '70%'}}/>
            </Card.Body>
        )
    };
    return (
        <>
            <Col xs={12} className="d-flex justify-content-end">
                <Image src={calendar} alt="Calendar image"
                    style={{ width: '5%' }}
                    onClick={() => navigate('/calendar')}/>
            </Col>
            <Col xs={12} sm={6} className="turtle-container">
                <Card style={{ height: '450px' }}>
                    <Card.Body>
                        <Card.Title>
                            <span style={{ fontSize: "30px" }}>
                                {userName}</span>의 거북잉
                        </Card.Title>
                    </Card.Body>
                    {turtleLevel >= 1 && turtleLevel <= 5
                    && getTurtleImage(turtleLevel)}          
                </Card>
            </Col>
        </>
    )
}