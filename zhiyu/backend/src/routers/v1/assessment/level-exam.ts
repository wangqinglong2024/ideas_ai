import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../../../core/auth'
import { success } from '../../../core/response'
import * as levelExamService from '../../../services/level-exam-service'
import { SubmitBatchAnswersSchema } from '../../../models/quiz-attempt'

const router = Router()

router.use(authMiddleware)

// GET /levels/:levelId/exam/eligibility — 检查考核资格
router.get('/levels/:levelId/exam/eligibility', async (req, res: Response) => {
  const { sub } = (req as unknown as AuthRequest).user
  const { levelId } = req.params

  const result = await levelExamService.checkEligibility(sub, levelId)
  success(res, result)
})

// POST /levels/:levelId/exam — 开始综合考核
router.post('/levels/:levelId/exam', async (req, res: Response) => {
  const { sub } = (req as unknown as AuthRequest).user
  const { levelId } = req.params

  const result = await levelExamService.startExam(sub, levelId)
  success(res, result)
})

// POST /assessments/:attemptId/submit-exam — 统一提交综合考核
router.post('/assessments/:attemptId/submit-exam', async (req, res: Response) => {
  const { sub } = (req as unknown as AuthRequest).user
  const { attemptId } = req.params
  const input = SubmitBatchAnswersSchema.parse(req.body)

  const result = await levelExamService.submitExam(sub, attemptId, input.answers)
  success(res, result)
})

// GET /levels/:levelId/exam/reports — 获取成绩报告
router.get('/levels/:levelId/exam/reports', async (req, res: Response) => {
  const { sub } = (req as unknown as AuthRequest).user
  const { levelId } = req.params

  const result = await levelExamService.getExamReports(sub, levelId)
  success(res, result)
})

export default router
