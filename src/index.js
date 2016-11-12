import publisher from './VoxImplantPublisher'
import api from './VoxImplantScenarioApi'

export default (authentication) => publisher(api(authentication))

