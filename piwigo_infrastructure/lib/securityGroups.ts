import { Stack, Construct } from '@aws-cdk/core';
import { Peer, Port, SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';

export class SecurityGroups extends Construct {

    public readonly AlbSecurityGroup: SecurityGroup;
    public readonly InstanceSecurityGroup: SecurityGroup
    public readonly DatabaseSecurityGroup: SecurityGroup

    constructor(parent: Stack, id: string, vpc: Vpc) {
        super(parent, id);

        this.AlbSecurityGroup = new SecurityGroup(this, 'alb-securitygrp', {
            vpc,
            allowAllOutbound: true
        });
        this.AlbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Inbound Traffic from anywhere to ALB');
        this.InstanceSecurityGroup = new SecurityGroup(this, 'webserver-securitygrp', {
            vpc,
            allowAllOutbound: true
        });
        this.InstanceSecurityGroup.addIngressRule(this.AlbSecurityGroup, Port.tcp(80), 'Allow Port 80 from ALB to Instance');
        this.DatabaseSecurityGroup = new SecurityGroup(this, 'db-securitygroup', {
            vpc,
            allowAllOutbound: true
        });
        this.DatabaseSecurityGroup.addIngressRule(this.InstanceSecurityGroup, Port.tcp(3306), 'Allow traffic from Webserver to Database');
    }
}
