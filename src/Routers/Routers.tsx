import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import { Home, Login, SignUp, Error } from '@/pages';
const Routers = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    )
}

export default Routers
