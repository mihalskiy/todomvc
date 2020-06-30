import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

aws.s3.getBucket({ bucket: 'todo.test' }).then((todoBucket) => {
  const todoRole = new aws.iam.Role('todo-role', {
    assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
`,
  })
  const todoRolePolicy = new aws.iam.RolePolicy('todo-rolePolicy', {
    policy: pulumi.interpolate`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeDhcpOptions",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterfacePermission"
      ],
      "Resource": [
        "arn:aws:ec2:us-east-1:123456789012:network-interface/*"
      ],
      "Condition": {
        "StringEquals": {
          "ec2:AuthorizedService": "codebuild.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${todoBucket.arn}",
        "${todoBucket.arn}/*"
      ]
    }
  ]
}
`,
    role: todoRole.name,
  })

  const todoProject = new aws.codebuild.Project('todo', {
    artifacts: {
      type: 'NO_ARTIFACTS',
    },
    buildTimeout: 5,
    cache: {
      location: todoBucket.bucket,
      type: 'S3',
    },
    description: 'test_codebuild_project',
    environment: {
      computeType: 'BUILD_GENERAL1_SMALL',
      image: 'aws/codebuild/standard:1.0',
      imagePullCredentialsType: 'CODEBUILD',
      type: 'LINUX_CONTAINER',
    },
    logsConfig: {
      cloudwatchLogs: {
        groupName: 'log-group',
        streamName: 'log-stream',
      },
      s3Logs: {
        location: pulumi.interpolate`${todoBucket.id}/build-log`,
        status: 'ENABLED',
      },
    },
    serviceRole: todoRole.arn,
    source: {
      gitCloneDepth: 1,
      gitSubmodulesConfig: {
        fetchSubmodules: true,
      },
      location: 'https://github.com/mihalskiy/todomvc.git',
      type: 'GITHUB',
    },
    sourceVersion: 'master',
    tags: {
      Environment: 'Todo',
    },
    // vpcConfig: {
    //   securityGroupIds: [
    //     aws_security_group_example1.id,
    //     aws_security_group_example2.id,
    //   ],
    //   subnets: [aws_subnet_example1.id, aws_subnet_example2.id],
    //   vpcId: aws_vpc_example.id,
    // },
  })
  const todo_with_cache = new aws.codebuild.Project('todo-with-cache', {
    artifacts: {
      type: 'NO_ARTIFACTS',
    },
    BuildSpec: {},
    buildTimeout: 5,
    cache: {
      modes: ['LOCAL_DOCKER_LAYER_CACHE', 'LOCAL_SOURCE_CACHE'],
      type: 'LOCAL',
    },
    description: 'test_codebuild_project_cache',
    environment: {
      computeType: 'BUILD_GENERAL1_SMALL',
      image: 'aws/codebuild/standard:1.0',
      imagePullCredentialsType: 'CODEBUILD',
      type: 'LINUX_CONTAINER',
    },
    queuedTimeout: 5,
    serviceRole: todoRole.arn,
    source: {
      gitCloneDepth: 1,
      location: 'https://github.com/mihalskiy/todomvc.git',
      type: 'GITHUB',
    },
    tags: {
      Environment: 'Test',
    },
  })
  const todoWebhook = new aws.codebuild.Webhook('todo-webhook', {
    filterGroups: [
      {
        filters: [
          {
            pattern: 'PUSH',
            type: 'EVENT',
          },
          {
            pattern: 'master',
            type: 'HEAD_REF',
          },
        ],
      },
    ],
    projectName: todo_with_cache.name,
  })
})
