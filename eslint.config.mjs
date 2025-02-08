import theConfig from '@marcrock22/eslint';
import { config } from 'typescript-eslint';

export default config(
    theConfig,
    {
        ignores: [
            'src/types/dtos/*.ts'
        ]
    }
)