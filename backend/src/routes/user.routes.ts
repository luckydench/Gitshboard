import Router from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/middlewares/auth';
import { authToken, authUser } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const user_router = Router();


// api/user
user_router.get('/', authToken, authUser, async (req: AuthRequest, res) => {

  const user = req.user!; //authUser 미들웨어에서 인증된 사용자 정보를 요청 객체에 추가했으므로 req.user는 항상 존재한다고 가정할 수 있음

  try{
        const accessToken = user.githubAccessToken;

        const github_response = await fetch('https://api.github.com/user', {
            headers : {
                'Authorization' : `token ${accessToken}`
            }
        }); 
        
        if(github_response.ok){
            const github_user = await github_response.json();

            res.status(200).json({
                user : github_user
            })
        }
        else{
            throw { status : github_response.status, message : 'GitHub API 요청 실패' };
        }
    }
    catch(err : unknown){
        //에러가 "객체" 형식임을 알려줘야 in 구문을 통해 속성이 존재하는 지를 확인하는 narrowing 이 가능함
        //추가로 null은 typeof를 찍어보면 object로 나오는... 자스의 이상한 버그 때문에 체크 해줘야 함
        if(typeof err === 'object' && err !== null && 'status' in err && 'message' in err){
            const { status, message } = err as { status : number, message : string };
            res.status(status).json({ error : message });
            return;
        }
        else{
            res.status(401).json({ error : '유효하지 않은 토큰입니다.' });
        }
    }

});

user_router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default user_router;