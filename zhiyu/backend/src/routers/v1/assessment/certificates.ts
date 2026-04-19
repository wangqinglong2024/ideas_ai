import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../../../core/auth'
import { success } from '../../../core/response'
import * as certificateService from '../../../services/certificate-service'

const router = Router()

router.use(authMiddleware)

// GET /certificates — 我的证书列表
router.get('/', async (req, res: Response) => {
  const { sub } = (req as unknown as AuthRequest).user
  const result = await certificateService.getUserCertificates(sub)
  success(res, result)
})

// GET /certificates/:certificateNo — 证书详情
router.get('/:certificateNo', async (req, res: Response) => {
  const { certificateNo } = req.params
  const result = await certificateService.getCertificateByNo(certificateNo)
  success(res, result)
})

export default router
