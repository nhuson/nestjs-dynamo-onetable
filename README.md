
# nestjs-dynamo-onetable

Start by installing the required dependencies:

```bash
  $ npm i nestjs-dynamo-onetable
```

Once the installation process is complete, we can import the OnetableModule into the root AppModule.

```javascript
(app.module.ts)

import { Module } from '@nestjs/common';
import { OnetableModule } from 'nestjs-dynamo-onetable';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Module({
  imports: [
      OnetableModule.forRoot({
        useFactory(config: ConfigService, client: DynamoDBClient) {
            return {
            client,
            global: false, // defaults to true
            name: config.getOrThrow('TABLE_NAME'),
            partial: true,
            schema: {
                format: 'onetable:1.1.0',
                version: '0.0.1',
                indexes: {
                primary: { hash: 'pk', sort: 'sk' },
                },
                models: {},
            },
            };
        },
        inject: [ConfigService, DynamoDBClient],
    })
  ],
})
export class AppModule {}
```

The forRoot() method accepts the same configuration object as `dynamodb-onetable`

# Model injection
Define your schema object table:
```javascript
(UserSchema.ts)

export const UserSchema = {
    pk: {type: String, value: 'account:${id}'},
    sk: {type: String, value: 'account:'},
    id: {type: String, generate: 'ulid', validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i},
    username: {type: String, required: true},
    email: {type: String, required: true},
}

```

### Import schema into your module
```javascript
(UserModule.ts)

@Module({
  imports: [
    OnetableModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserModule {}

```

### Inject model into service or repository

```javascript
(UserService.ts)
import { Model } from 'nestjs-dynamo-onetable';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<typeof UserSchema>) {}

  getUser() {
    this.userModel.find({ pk: 'pk01', sk: 'sk01' });
  }
}

```
It able to use with repository then inject your repository into service.
